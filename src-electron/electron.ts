import { app, BrowserWindow } from "electron";
import path from "path";
import listener from "./listener";
import launcher from "./launcher";
import { login } from "./login";


const createWindow = () => {
  let win = new BrowserWindow({
    width: 1340,
    height: 800,
    frame: false,
    backgroundColor: "#131C2E",
    webPreferences: {
       // electron 보안정책에 의해서 처리한다
       nodeIntegration: false,
       contextIsolation: true,
       enableRemoteModule: false,

       preload: path.join(__dirname, "preload.js")
    },
    show: false
  });
  return win;
}

//app.whenReady().then(createWindow);
app.whenReady().then(async () => {
  const mainWin = createWindow();
  const result = await login();

  // 제대로 처리할 방법을 찾아보자.. 일단은 귀찮으니 이렇게
  mainWin.loadURL('http://localhost:3000');
  //mainWin.webContents.openDevTools();
  // 앱 설정을 초기화한다
  listener(mainWin);
  launcher(result);
  mainWin.show();
})
  
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
  }
});