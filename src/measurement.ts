import "./measurement.less";
import * as Plotly from "plotly.js";
import { DataStore } from "./data/dataStore";
import { getRoadDescription } from "./ui/roadTypeDialog/roadTypeDialog";

(async () => {
    let dataStore = new DataStore();

    let fileName = window.location.hash.substring(1);
    let item = await dataStore.getItem(fileName);

    if (!item) {
        window.history.back();
        return;
    }

    document.querySelector("#road-type").textContent = getRoadDescription(item.type);
    document.querySelector("#description").textContent = item.description || "Нет описания";

    let plotData = item.data.reduce(({ x: x, y: y }, point) => {
        return {
            x: [...x, new Date(point.datetime)],
            y: [...y, point.value]
        };
    }, { x: [], y: [] })

    Plotly.newPlot("line-chart", [{
        ...plotData,
        mode: "lines",
        line: {
            color: "red",
            width: 1
        }
    }], {
        selectdirection: "h",
        dragmode: "pan",
        yaxis: {
            fixedrange: true
        }
    }, {
        scrollZoom: true
    });

    Plotly.newPlot("box-chart", [{
        y: plotData.y,
        type: "box"
    }]);
})();