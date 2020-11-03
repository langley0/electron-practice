import { ipcRenderer, contextBridge } from "electron";

// 메인 시스템과 브라우저 스크립트가 서로 통신하기 위한 모듈을 설정한다
process.once("loaded", () => {
    window.addEventListener("__BROWSER_MESSAGE__", (event) => {
        ipcRenderer.send("__BROWSER_MESSAGE__", (<CustomEvent>event).detail);
    });

    ipcRenderer.on("__CORE_MESSAGE__", (event, data) => {
        window.dispatchEvent(
            new CustomEvent("__CORE_MESSAGE__", { detail: data })
        );
    });
});

void (function () {
    interface RequestInfo { 
        resolve: (value?: unknown | PromiseLike<unknown>) => void, 
        reject: (reason?: unknown) => void, 
        t: NodeJS.Timeout
    };
    const requestMap: Record<string, RequestInfo> = {};
    const typeHandlerMap: Record<string, Function> = {};

    contextBridge.exposeInMainWorld("__ICP__", {
        sendMessage(type: string, value: string) {
            const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const event = new CustomEvent("__BROWSER_MESSAGE__", {
                detail: { type, id, value },
            });

            if (typeof window !== "undefined") {
                window.dispatchEvent(event);
            }
            return new Promise((resolve, reject) => {
                const t = setTimeout(
                    () => reject(new Error("Timeout exceeded")),
                    15 * 1000
                );
                requestMap[id] = { resolve, reject, t };
            });
        },
        handleMessage(type: string, fn: Function) {
            typeHandlerMap[type] = fn;
        },
    });

    // 요청한 메시지의 응답을 받게 되면 resolve 를 실행한다
    window.addEventListener("__CORE_MESSAGE__", (event) => {
        const { type, id, value, success } = (<CustomEvent>event).detail;

        if (typeof id === "string" && id in requestMap) {
            // 코어시스템에 브라우저에서 요청한 값에 대한 응답이 온 경우이다
            const { resolve, reject, t } = requestMap[id];
            clearTimeout(t);
            if (success) { resolve(value); }
            else { reject(value); }
            delete requestMap[id];
        } else if (typeof typeHandlerMap[type] === "function") {
            // 코어시스템에서 브라우저의 핸들러함수를 호출하는 경우이다
            const fn = typeHandlerMap[type];
            fn(value);
        } else {
            console.warn("Received unhandled core message", { type, id, value, success });
        }
    });
}) ();