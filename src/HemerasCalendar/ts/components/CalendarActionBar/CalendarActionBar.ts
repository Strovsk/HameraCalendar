import ActionButton from "./ActionButton";

export default class CalendarActionBar {
    private containerElm: HTMLElement = document.createElement('div');
    public okButton: ActionButton = new ActionButton('Ok');
    public cancelButton: ActionButton = new ActionButton('Cancel');

    constructor() {
        this.containerElm.classList.add('CalendarActionContainer');
        this.containerElm.appendChild(this.okButton.container);
        this.containerElm.appendChild(this.cancelButton.container);
    }

    public get container() : HTMLElement {
        return this.containerElm;
    }

    public open() {
        this.containerElm.removeAttribute('close');
        this.containerElm.setAttribute('open', '');
    }

    public close() {
        this.container.removeAttribute('open');
        this.containerElm.setAttribute('close', '');
    }
}
