import "./measure.less";
import { Chart } from "./ui/chart";
import { RoadMeasure } from "./acceleration/roadMeasure";
import { RandomMeasure } from "./acceleration/randomMeasure";
import { isMotionSupported, isOrientationSupported } from "./utils/supportUtils";
import { DataCollector } from "./data/dataCollector";
import { disable, enable, hide, show } from "./utils/htmlUtils";
import { RoadTypeDialog } from "./ui/roadTypeDialog/roadTypeDialog";
import { TitleDialog } from './ui/titleDialog/titleDialog';
import { DataStore } from "./data/dataStore";
import { toast } from './ui/toast/toast';
import { IMeasureSource } from './acceleration/measure';
import { timer } from "./utils/timer";
import { CountDown } from "./ui/countdown/countdown";
import { Duration } from "./ui/duration";

const measures: IMeasureSource = isOrientationSupported() && isMotionSupported() && false
                        ? new RoadMeasure()
                        : new RandomMeasure();

const data = new DataCollector(measures);
let chart = new Chart(document.querySelector("#chart"));
let duration = new Duration(document.querySelector("#measures"));
let dataStore = new DataStore();

data.attach("update", () => {
    chart.draw(data.values.map(v => v.value));
    duration.value = data.duration;
});

let start = document.querySelector("#start") as HTMLElement;
let stop = document.querySelector("#stop") as HTMLElement;
let save = document.querySelector("#save") as HTMLElement;
let countdown = new CountDown(document.querySelector("#countdown") as HTMLElement);

show(start);
hide(stop);
hide(save);

countdown.shown = false;

const clearData = () => {
    data.clear();
    chart.clear();
};

const stopMeasure = () => {
    show(start);
    hide(stop);
    start.textContent = "Сначала!";

    if (data.complete) {
        show(save);
    }
};

start.addEventListener("click", async () => {
    clearData();

    hide(start);
    show(stop);
    hide(save);

    chart.shown = false;
    duration.shown = false;
    countdown.shown = true;
    let cValue = 3;
    while (cValue > 0) {
        countdown.value = cValue--;
        await timer(1000);
    }
    countdown.shown = false;
    chart.shown = true;
    duration.shown = true;

    enable(stop);

    await data.collect();

    stopMeasure();
}, false);

stop.addEventListener("click", () => {
    data.stop();
    stopMeasure();
}, false);

save.addEventListener("click", async () => {
    [start, stop, save].forEach(disable);

    try {
        let type = await new RoadTypeDialog().getRoadType();
        let description = await new TitleDialog().getTitle();

        await dataStore.addItem({
            description,
            type,
            data: data.values
        });

        toast("Сохранено");
        [start, stop, save].forEach(enable);
        [stop, save].forEach(hide);
        start.textContent = "Начать";
    } catch(e) {
        [start, stop, save].forEach(enable);
        if (e) {
            toast("Что-то пошло не так", "error");
        }
    }
});