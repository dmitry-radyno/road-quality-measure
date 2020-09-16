import './app.less';
import { Chart } from "./ui/chart";
import { CumulativeAvg } from "./cumulativeAvg";
import { IMovement, RoadMeasure } from "./acceleration/roadMeasure";
import { RandomMeasure } from "./acceleration/randomMeasure";
import { isMotionSupported, isOrientationSupported } from "./utils/supportUtils";
import { DataCollector } from "./dataCollector";
import { disable, enable } from "./utils/htmlUtils";
import { AvgView } from "./ui/avgView";
import { PollManager } from "./ui/pollManager";

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
const avgView = new AvgView(document.querySelector("#measures") as HTMLElement, avg);

data.attach("update", (value: number) => {
    avg.add(value);
    chart.draw(data.values.map(v => v.value));
});

let start = document.querySelector("#start") as HTMLElement;
let stop = document.querySelector("#stop") as HTMLElement;
let save = document.querySelector("#save") as HTMLElement;
let clear = document.querySelector("#clear") as HTMLElement;

disable(stop);
disable(save);
disable(clear);

start.addEventListener("click", async () => {
    await data.start();

    disable(start);
    enable(stop);
    disable(save);
    disable(clear);
}, false);

stop.addEventListener("click", () => {
    data.stop();

    enable(start);
    disable(stop);
    enable(save);
    enable(clear);
}, false);

clear.addEventListener("click", () => {
    data.clear();
    avg.clear();
    chart.clear();

    disable(save);
    disable(clear);
}, false);

save.addEventListener("click", async () => {
    [start, stop, save, clear].forEach(disable);

    let pollManager = new PollManager();
    let type = await pollManager.getRoadType();
    let name = await pollManager.getTitle();

    /* await dataStore.setItem({
        name,
        type,
        data: data.values
    }); */

    let dataItem = {
        name,
        type,
        data: data.values
    };
    console.log(dataItem);

    [start, save, clear].forEach(enable);
});