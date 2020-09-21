import "./measure.less";
import { Chart } from "./ui/chart";
import { CumulativeAvg } from "./data/cumulativeAvg";
import { RoadMeasure } from "./acceleration/roadMeasure";
import { RandomMeasure } from "./acceleration/randomMeasure";
import { isMotionSupported, isOrientationSupported } from "./utils/supportUtils";
import { DataCollector } from "./data/dataCollector";
import { disable, enable, hide, show } from "./utils/htmlUtils";
import { AvgView } from "./ui/avgView";
import { RoadTypeDialog } from "./ui/roadTypeDialog/roadTypeDialog";
import { TitleDialog } from './ui/titleDialog/titleDialog';
import { DataStore } from "./data/dataStore";
import { toast } from './ui/toast/toast';
import { IMeasureSource } from './acceleration/measure';

const measures: IMeasureSource = isOrientationSupported() && isMotionSupported()
                        ? new RoadMeasure()
                        : new RandomMeasure();

const data = new DataCollector(measures);
let chart = new Chart(document.querySelector("#chart"));
let avg = new CumulativeAvg();
new AvgView(document.querySelector("#measures") as HTMLElement, avg);
let dataStore = new DataStore();

data.attach("update", (value: number) => {
    avg.add(value);
    chart.draw(data.values.map(v => v.value));
});

let start = document.querySelector("#start") as HTMLElement;
let stop = document.querySelector("#stop") as HTMLElement;
let save = document.querySelector("#save") as HTMLElement;
let clear = document.querySelector("#clear") as HTMLElement;

show(start);
hide(stop);
disable(save);
disable(clear);

start.addEventListener("click", async () => {
    await data.start();

    hide(start);
    show(stop);
    disable(save);
    disable(clear);
}, false);

stop.addEventListener("click", () => {
    data.stop();

    show(start);
    hide(stop);
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

    try {
        let type = await new RoadTypeDialog().getRoadType();
        let description = await new TitleDialog().getTitle();

        await dataStore.addItem({
            description,
            type,
            data: data.values
        });

        toast("Сохранено");
        [start, stop, save, clear].forEach(enable);
    } catch(e) {
        [start, stop, save, clear].forEach(enable);
        if (e) {
            toast("Что-то пошло не так", "error");
        }
    }
});