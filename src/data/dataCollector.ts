import { EventHandler } from "../utils/eventHandler";
import { IMeasureSource } from "../acceleration/measure";

interface IDataPoint {
    datetime: number;
    value: number;
}

const CAPTURE_DURATION = 30000;

export class DataCollector extends EventHandler {

    private data: IDataPoint[] = [];
    private timeout = 0;
    private started: number;

    private async capture() {
        let value = this.measures.value.z;

        this.data.push({
            datetime: Date.now(),
            value
        });
        this.trigger("update", value);
        await this.scheduleNextCapture();
    }

    private timer(timeout: number) {
        return new Promise((res) => {
            this.timeout = setTimeout(res, timeout);
        });
    }
    private async scheduleNextCapture() {
        let diff = Date.now() - this.started;

        if (diff < CAPTURE_DURATION) {
            await this.timer(10);
            await this.capture();
            return;
        }
        this.timeout = 0;
    }

    constructor(
        private readonly measures: IMeasureSource
    ) {
        super();
    }

    get values() {
        return this.data;
    }

    async collect() {
        if (!this.capturing) {
            await this.measures.start();

            this.started = Date.now();
            await this.scheduleNextCapture();
        }
    }

    stop() {
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }

    get capturing() {
        return !!this.timeout;
    }

    get complete() {
        let diff = Date.now() - this.started;
        return diff >= CAPTURE_DURATION;
    }

    get duration() {
        return Math.min(Date.now() - this.started, CAPTURE_DURATION);
    }

    clear() {
        this.data = [];
    }
}