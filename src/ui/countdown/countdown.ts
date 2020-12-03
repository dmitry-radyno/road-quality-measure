import { toggle } from "../../utils/htmlUtils";
import "./countdown.less";

export class CountDown {
    constructor(
        private readonly container: HTMLElement
    ) {
        this.container.classList.add("countdown");
    }

    set value(v: number) {
        this.container.textContent = v.toString();
    }

    set shown(isShown: boolean) {
        toggle(this.container, isShown);
    }
}