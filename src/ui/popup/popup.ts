import "./popup.less";
import { addClass, hide, show } from "../../utils/htmlUtils";

export class Popup {
    
    private readonly container: HTMLElement;
    private readonly content: HTMLElement;
    private readonly overlay: HTMLElement;

    private injectContent(content: HTMLElement | DocumentFragment | string) {
        if (typeof content === "string") {
            this.content.innerHTML = content;
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
        private readonly parent: HTMLElement,
        title: string
    ) {
        this.container = document.createElement("div");
        addClass(this.container, "popup");
        addClass(this.container, "popup--big");
        this.container.innerHTML = `<div class="popup__title"></div>
                                    <div class="popup__content"></div>`;
        hide(this.container);

        this.overlay = document.createElement("div");
        addClass(this.overlay, "popup-overlay");
        hide(this.overlay);

        parent.appendChild(this.overlay);
        parent.appendChild(this.container);
        this.content = this.container.querySelector(".popup__content") as HTMLElement;
        (this.container.querySelector(".popup__title") as HTMLElement).textContent = title;
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