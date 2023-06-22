import CalendarLabel from "./CalendarLabel";
import CalendarController from "./CalendarController";

export default class CalendarHeader {
    public containerElm: HTMLElement = document.createElement('div');
    public labelElm: CalendarLabel = new CalendarLabel();
    public controllerElm: CalendarController = new CalendarController();

    constructor() {
        this.loadHTMLStructure();
    }
    
    private loadHTMLStructure() {
        this.containerElm.classList.add('CalendarYearMonthController');
        this.containerElm.appendChild(this.labelElm.container);
        this.containerElm.appendChild(this.controllerElm.container);
    }

    public get container() {
        return this.containerElm;
    }
}
