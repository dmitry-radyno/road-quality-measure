import { Chart } from "./chart";
import { CumulativeAvg } from "./cumulativeAvg";
import { formatNumber } from "./utils/formatUtils";
import { IMovement, RoadMeasure } from "./acceleration/roadMeasure";
import { RandomMeasure } from "./acceleration/randomMeasure";
import { isMotionSupported, isOrientationSupported } from "./supportUtils";
import { DataCollector } from "./dataCollector";

export interface IMeasureSource {
    value: IMovement;
    start: () => void;
}

const measures: IMeasureSource = isOrientationSupported() && isMotionSupported()
                        ? new RoadMeasure()
                        : new RandomMeasure();

const data = new DataCollector(measures);
let chart = new Chart(document.querySelector("#chart"));
let avg = new CumulativeAvg();
let result = document.querySelector("#measures") as HTMLElement;

data.attach("update", (value: number) => {
    avg.add(value);
    result.innerHTML = `${formatNumber(avg.value)} (${formatNumber(Math.sqrt(avg.dispersion))})`;

    chart.draw(data.values.map(v => v.value));
});

let start = document.querySelector("#start") as HTMLElement;
start.addEventListener("click", async () => {
    if (!data.isCapturing()) {
        await data.start();
        start.textContent = "Stop";
        return;
    }
    data.stop();
    start.textContent = "Go!";
}, false);