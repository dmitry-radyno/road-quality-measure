import "./measurements.less";
import { DataStore } from "./data/dataStore";
import { List } from "./ui/list/list";

(async () => {
    let dataStore = new DataStore();
    let items = await dataStore.getItems();

    let list = new List<string>(value => `<a href="measurement.html#${value}" class="measurement">${value}</a>`);
    list.mount(document.querySelector("#measurements"));
    list.value = items;

    console.log(items);
})();