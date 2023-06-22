export default class CalendarLabel {
    public containerElm: HTMLElement = document.createElement('button');
    private _text: string;

    constructor(text: string = '') {
        this._text = text;
        this.containerElm.innerText = this._text;

        this.loadContainerStyle();
    }

    private loadContainerStyle() {
        this.containerElm.classList.add('CalendarMonthYear');
    }

    public set text(value: string) {
        this._text = value;
        this.containerElm.innerText = this._text;
    }

    public get container() {
        return this.containerElm;
    }
}