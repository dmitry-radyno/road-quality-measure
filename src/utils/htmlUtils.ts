export const addClass = (el: HTMLElement, className: string) => {
    if (!el.classList.contains(className)) {
        el.classList.add(className);
    }
};

export const removeClass = (el: HTMLElement, className: string) => {
    el.classList.remove(className);
};

export const hide = (el: HTMLElement) => addClass(el, "hidden");

export const show = (el: HTMLElement) => removeClass(el, "hidden");

export const disable = (el: HTMLElement) => el.setAttribute("disabled", "");

export const enable = (el: HTMLElement) => el.removeAttribute("disabled");

export const htmlEscape = (str: string) => str.replace(/&/g, "&amp;")
                                            .replace(/</g, "&lt;")
                                            .replace(/>/g, "&gt;")
                                            .replace(/"/g, "&quot;")
                                            .replace(/'/g, "&#039;");