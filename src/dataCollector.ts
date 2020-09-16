import { EventHandler } from "./utils/eventHandler";
import { IMeasureSource } from "./index";

interface IDataPoint {
    datetime: number;
    value: number;
}

export class DataCollector extends EventHandler {

    private data: IDataPoint[] = [];
    private timeout = 0;

    private capture() {
        let value = this.measures.value.z;

        this.data.push({
            datetime: Date.now(),
            value
        });
        this.trigger("update", value);
    }

    constructor(
        private readonly measures: IMeasureSource
    ) {
        super();
    }

    get values() {
        return this.data;
    }

    async start() {
        if (!this.isCapturing()) {
            await this.measures.start();
            this.timeout = setInterval(this.capture.bind(this), 50);
        }
    }

    stop() {
        clearInterval(this.timeout);
        this.timeout = 0;
    }

    isCapturing() {
        return !!this.timeout;
    }

    clear() {
        this.stop();
        this.data = [];
    }
}