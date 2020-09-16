import { addClass, hide, show } from "../../utils/htmlUtils";

export class Popup {
    
    private readonly container: HTMLElement;
    private readonly overlay: HTMLElement;

    private injectContent(content: HTMLElement | DocumentFragment | string) {
        if (typeof content === "string") {
            this.container.innerHTML = content;
            return;
        }
        this.container.appendChild(content);
    }

    constructor(parent: HTMLElement) {
        this.container = document.createElement("div");
        addClass(this.container, "popup");
        hide(this.container);

        this.overlay = document.createElement("div");
        addClass(this.overlay, "popup-overlay");
        hide(this.overlay);

        parent.appendChild(this.overlay);
        parent.appendChild(this.container);
    }

    show(content: HTMLElement | DocumentFragment | string) {
        this.injectContent(content);

        show(this.overlay);
        show(this.container);
    }

    hide() {
        hide(this.container);
    }
}