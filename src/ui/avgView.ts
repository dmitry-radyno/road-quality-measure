import { formatNumber } from "../utils/formatUtils";

interface IAvgSource {
    value: number;
    dispersion: number;
    attach: (eventName: "update", callback: () => void) => void;
}

export class AvgView {

    private onUpdate() {
        this.container.innerHTML = `${formatNumber(this.avg.value)} (${formatNumber(Math.sqrt(this.avg.dispersion))})`;
    }

    constructor(
        private readonly container: HTMLElement,
        private readonly avg: IAvgSource
    ) {
        this.avg.attach("update", this.onUpdate.bind(this));
    }
}