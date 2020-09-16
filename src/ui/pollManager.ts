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

export class PollManager {
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
                </div>
                
                <div class="road-types__controls">
                    <button class="road-types__cancel" id="cancel">Отменить</button>
                    <button class="road-types__apply" id="apply">Дальше</button>
                </div>`);
        });
    }

    getTitle() {
        return new Promise((resolve, reject) => {
            setTimeout("Мой первый замер");
        });
    }
}