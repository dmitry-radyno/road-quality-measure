export function toast(text: string, type: "normal" | "error" = "normal", timeout = 3000) {
    let div = document.createElement("div");
    div.className = "toast";
    div.textContent = text;

    if (type === "error") {
        div.classList.add("toast--error");
    }

    document.body.appendChild(div);

    const close = () => {
        div.parentNode.removeChild(div);
        div = null;
        clearTimeout(timerId);
    };

    div.addEventListener("click", close, false);

    const timerId = setTimeout(() => {
        close();
    }, timeout);
}