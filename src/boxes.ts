import "./boxes.less";
import * as Plotly from "plotly.js";
import { DataStore } from "./data/dataStore";
import { getRoadDescription } from "./ui/roadTypeDialog/roadTypeDialog";

(async () => {
    let dataStore = new DataStore();

    let args = window.location.hash.substring(1);
    let files = args.split(",");
    let items = await Promise.all(files.map(dataStore.getItem))

    if (!items.length) {
        window.history.back();
        return;
    }

    Plotly.newPlot("box-chart", items.map(item => {
        return {
            name: getRoadDescription(item.type) + ` (${item.description})`,
            y: item.data.map(p => p.value),
            type: "box"
        };
    }));
})();