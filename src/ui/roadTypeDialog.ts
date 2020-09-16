import { htmlEscape } from "../utils/htmlUtils";
import { Popup } from "./popup/popup";

export type TRoadType = "asphalt" | "tile-square" | "tile-short" | "tile-long" | "other" | "tile-square-rough" | "tile-square-smooth";

const roadTypes: { [key: string]: string } = {
    "asphalt": "Асфальт",
    "tile-square": "Плитка квадратная",
    "tile-short": "Плитка поперек",
    "tile-long": "Плитка вдоль",
    "tile-rough": "Плитка грубая",
    "tile-smooth": "Плитка гладкая",
    "other": "Другое"
};

export class RoadTypeDialog {
    getRoadType() {
        return new Promise((resolve, reject) => {
            let popup = new Popup(document.body);
            
            let roadTypesHtml = Object.keys(roadTypes).map(value => {
                let label = roadTypes[value];
                return `<label class="road-types__item">
                            <input class="road-types__radio" type="radio" name="road-type" value="${ htmlEscape(value) }" />
                            <span class="road-types__text">${ label }</span>
                        </label>`;
            }).join("");

            popup.show(`
                <div class="road-types">
                    <div class="road-types__options">${roadTypesHtml}</div>
                    <div class="road-types__controls">
                        <button class="secondary-button road-types__control road-types__cancel">Отменить</button>
                        <button class="primary-button road-types__control road-types__apply">Дальше</button>
                    </div>
                </div>`);

            popup.element.querySelector(".road-types__cancel").addEventListener("click", () => {
                popup.hide();
                popup.destroy();
                reject();
            }, false);

            popup.element.querySelector(".road-types__apply").addEventListener("click", () => {
                let checked = popup.element.querySelector<HTMLInputElement>(".road-types__radio:checked");

                if (checked) {
                    let value = checked.value;
                    popup.hide();
                    popup.destroy();
                    resolve(value);
                }
            }, false);
        });
    }

    getTitle() {
        return new Promise((resolve, reject) => {
            setTimeout("Мой первый замер");
        });
    }
}