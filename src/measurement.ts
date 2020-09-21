import "./measurement.less";
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
    console.log(item);
})();