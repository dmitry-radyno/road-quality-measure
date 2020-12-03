import { toggle } from "../utils/htmlUtils";

export class Duration {
    
    constructor(
        private readonly container: HTMLElement
    ) {

    }

    set value(durationMs: number) {
        let time = (durationMs / 1000).toFixed(2);
        if (time.indexOf(".") === 1) {
            time = `0${time}`;
        }
        this.container.textContent = `00:${time}`;
    }

    set shown(isShown: boolean) {
        toggle(this.container, isShown);
    }
}