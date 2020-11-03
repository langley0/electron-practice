import path from "path";
import { BrowserWindow, session } from "electron";
import listener, { addListener } from "./listener";
import types from "../public/events.json";

export async function login() {
  const win = new BrowserWindow({
    width: 370,
    height: 540,
    frame: false,
    backgroundColor: "#131C2E",
    webPreferences: {
      // electron 보안정책에 의해서 처리한다
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,

      preload: path.join(__dirname, "preload.js")
    },
    show: false,
  });
    
  win.loadFile("public/login.html");
  win.setResizable(false);
  listener(win);

  const nexonAuth = new BrowserWindow({
    width: 480,
    height: 640,
    frame: false,
    webPreferences: {
       // electron 보안정책에 의해서 처리한다
       nodeIntegration: false,
       contextIsolation: true,
       enableRemoteModule: false,

       preload: path.join(__dirname, "preload.js")
    },
    show: false,
  });

  nexonAuth.loadURL("https://nxlogin.nexon.com/");
  nexonAuth.webContents.once("dom-ready", () => {
    // dom 설정이 끝나면 show 한다
    // 스피너도 나쁘지 않을듯
    win.show();
  });

  return new Promise((resolve, reject) => {
    // login 명령을 처리한다
    addListener(types.LOGIN, (account: { id: string, password: string }) => {
      // 로그인을 위해서 새롭게 로그인창을 띄워서 npp 를 가져온다
      tryNexonLogin(nexonAuth, account.id, account.password)
      .then((result) => {
        // 자신을 끝내고 로그인 성공시 필요한 원래 사이트를 띄운다
        resolve(result);
        win.close();
        nexonAuth.close();
      })
      .catch(() => {
        console.error('fail to login');
        // 화면에 실패를 출력한다
      });
    });
  });
}

function tryNexonLogin(auth: BrowserWindow, id: string, password: string) {
  return new Promise((resolve, reject) => {
    auth.webContents.executeJavaScript(`
    $("#txtNexonID").val("${id}");
    $("#txtPWD").val("${password}");
    $.NxLogin.Login($.NxLogin.RedirectURL);
    `);

    auth.webContents.once("will-redirect", (event, url) => {
      // 윈도우는 무조건 닫는다.
      if (url.startsWith("https://nxlogin.nexon.com/common/login.aspx")) {
        // 실패
        reject();
      } else {
        session.defaultSession.cookies.get({})
        .then((cookies) => { 
          const npp = cookies.find((e) => e.name === 'NPP');
          const enc = cookies.find((e) => e.name === 'ENC');
          const il = cookies.find((e) => e.name === 'IL');
          const nxch = cookies.find((e) => e.name === 'NXCH');
          const im = cookies.find((e) => e.name === 'IM');
          const rdb = cookies.find((e) => e.name === 'RDB');
          // 이벤트를 알린다
          resolve([ npp, enc, il, nxch, im, rdb ]);
        });
      }
    });
  });
}