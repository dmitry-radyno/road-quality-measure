import "./titleDialog.less";
import { Popup } from "../popup/popup";

export class TitleDialog {
    getTitle() {
        return new Promise<string>((resolve, reject) => {
            let popup = new Popup(document.body, "Где? Как?");

            popup.show(`
                <div class="title-dialog">
                    <label class="title-dialog__label">
                        <textarea class="title-dialog__input"></textarea>
                    </label>
                    <div class="title-dialog__controls">
                        <button class="secondary-button secondary-button--big title-dialog__control title-dialog__cancel" id="cancel">Отменить</button>
                        <button class="primary-button primary-button--big title-dialog__control title-dialog__apply" id="apply">Дальше</button>
                    </div>
                </div>`);

            popup.element.querySelector<HTMLTextAreaElement>(".title-dialog__input").focus();

            popup.element.querySelector(".title-dialog__cancel").addEventListener("click", () => {
                popup.hide();
                popup.destroy();
                reject();
            }, false);

            popup.element.querySelector(".title-dialog__apply").addEventListener("click", () => {
                let input = popup.element.querySelector<HTMLInputElement>(".title-dialog__input");
                let value = input.value;

                if (value.trim().length) {
                    popup.hide();
                    popup.destroy();
                    resolve(value);
                }
            }, false);
        });
    }
}