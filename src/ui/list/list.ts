import "./list.less";

type TListRenderer<T> = (item: T) => string;

export class List<T = string> {

    private list: HTMLElement;

    constructor(
        private readonly renderer?: TListRenderer<T>
    ) {
    }

    mount(container: HTMLElement) {
        this.list = document.createElement("ul");
        this.list.className = "list";

        container.appendChild(this.list);
    }

    set value(items: T[]) {
        this.list.innerHTML = items.map(item => `<li class="list__item">${this.renderer(item)}</li>`).join("");
    }
}