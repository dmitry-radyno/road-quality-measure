import "./measurements.less";
import { DataStore, IMeasurementMetaId } from "./data/dataStore";
import { List } from "./ui/list/list";
import { getRoadDescription } from "./ui/roadTypeDialog/roadTypeDialog";
import { htmlEscape } from "./utils/htmlUtils";

(async () => {
    let dataStore = new DataStore();
    let items = await dataStore.getItems();

    let list = new List<IMeasurementMetaId>(value => `<div class="measurement">
        <input class="measurement__checkbox" type="checkbox" name="compare" id="${value.id}" />
        <a class="measurement__link" href="measurement.html#${value.id}">
            <div class="measurement__primary">${getRoadDescription(value.type)}</div>
            <div class="measurement__secondary">${htmlEscape(value.description)}</div>
        </a>
    </div>`);
    list.mount(document.querySelector("#measurements"));
    list.value = items;

    let compareButton = document.querySelector<HTMLButtonElement>("#compare");
    let els = document.querySelectorAll<HTMLInputElement>(".measurement__checkbox");
    let checkboxes = [].map.call(els, (el: HTMLInputElement) => el) as HTMLInputElement[];

    const changeCompareState = () => {
        let hasAnythingSelected = checkboxes.some(checkbox => checkbox.checked);
        compareButton.disabled = !hasAnythingSelected;

        let fileNames = checkboxes.filter(ch => ch.checked).map(ch => ch.getAttribute("id"));
        compareButton.setAttribute("href", `boxes.html#${fileNames.join(",")}`);
    };

    checkboxes.forEach((checkbox: HTMLElement) => {
        checkbox.addEventListener("change", changeCompareState, false);
    });
    changeCompareState();
})();