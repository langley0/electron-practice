//import { BrowserWindow, app, ipcMain } from 'electron';
import types from "../public/events.json";
import { addListener } from "./listener";

export default function (options: unknown) {
  addListener(types.RUN, () => {
    // 여기서 실행한다
    alert("game: run");
  });
}