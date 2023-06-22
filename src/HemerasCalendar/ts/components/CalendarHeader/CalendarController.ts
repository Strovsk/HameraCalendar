export default class CalendarController {
    public containerElm: HTMLElement = document.createElement('div');
    public prevYearMonthElm: HTMLElement = document.createElement('button');
    public nextYearMonthElm: HTMLElement = document.createElement('button');

    constructor() {
        this.loadHTMLStructure();
    }

    loadHTMLStructure() {
        this.containerElm.appendChild(this.prevYearMonthElm);
        this.containerElm.appendChild(this.nextYearMonthElm);

        this.prevYearMonthElm.classList.add(
            'CalendarYearMonthController-button',
            '--previous',
        );

        this.nextYearMonthElm.classList.add(
            'CalendarYearMonthController-button',
            '--next',
        );
        this.containerElm.classList.add(
            'CalendarYearMonthController-buttonConatiner',
        );
    }

    public get container() {
        return this.containerElm;
    }
}