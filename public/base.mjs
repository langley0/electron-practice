// 이벤트 타입 json 파일을 로딩한다
const types = {};
const fetchRequest = fetch("./events.json")
.then((response) => response.json())
.then((data) => {
    for (const key in data) {
        types[key] = data[key];
    }
});

async function fetchTypes() {
    await fetchRequest;
}

// 코어로 메시지를 전송한다
export default function sendMessage(type, value) {
    return window.__ICP__.sendMessage(type, value);
}

(async () => {
    await fetchTypes();

    // Window events
    document.getElementById("minimize").addEventListener("click", async () => {
        await sendMessage(types.APP_MINIMIZE);
    });
    document.getElementById("maximize").addEventListener("click", async () => {
        await sendMessage(types.APP_MAXIMIZE);
    });
    document.getElementById("close").addEventListener("click", async () => {
        sendMessage(types.APP_CLOSE);
    });

    // mac 에서는 이 버튼들을 다 제거하자 (프레임리스가 안되나보다)
})();