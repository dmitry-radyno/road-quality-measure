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

    private calcPos() {
        let width = this.container.offsetWidth;
        let height = this.container.offsetHeight;
        let parentWidth = this.parent.offsetWidth;
        let parentHeight = this.parent.offsetHeight;
        this.container.style.left = `${(parentWidth - width) / 2}px`;
        this.container.style.top = `${(parentHeight - height) / 2}px`;
    }

    constructor(
        private readonly parent: HTMLElement
    ) {
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
        this.calcPos();
    }

    hide() {
        hide(this.overlay);
        hide(this.container);
    }

    destroy() {
        this.overlay.parentNode.removeChild(this.overlay);
        this.container.parentNode.removeChild(this.container);
    }

    get element() {
        return this.container;
    }
}