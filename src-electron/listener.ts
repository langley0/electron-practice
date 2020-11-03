import types from "../public/events.json";
import { BrowserWindow, app, ipcMain } from 'electron';

const listeners: Record<string, Function> = {};

export  const addListener = (type: string, callback: Function) => {
  if (listeners[type]) return;
  listeners[type] = callback;
};

export default (windowInstance: BrowserWindow) => {
    const respondToMessage = (type: string, id: string, value: unknown, success: boolean) => {
        windowInstance.webContents.send("__CORE_MESSAGE__", { type, id, value, success, });
    };

    ipcMain.on("__BROWSER_MESSAGE__", async (event, message) => {
        const { type, id, value } = message;
        if (!listeners[type]) {
            respondToMessage(
                type,
                id,
                new Error(`Unhandled event type "${type}"`),
                false
            );
            console.warn("Received unhandled renderer message", message);
            return;
        }

        const callback = listeners[type];
        try {
            const result = await callback(value);
            if (typeof result !== "undefined") {
                respondToMessage(type, id, result, true);
            }
        } catch (error) {
            console.error("BROWSER RESPONSE", error);
            respondToMessage(type, id, error, false);
        }
    });

    addListener(types.APP_MINIMIZE, async () => {
        windowInstance.minimize();
        return true;
    });

    addListener(types.APP_MAXIMIZE, async () => {
        if (windowInstance.isMaximized()) windowInstance.unmaximize();
        else windowInstance.maximize();
        return true;
    });

    addListener(types.APP_CLOSE, async () => {
        app.quit();
    });
};
  