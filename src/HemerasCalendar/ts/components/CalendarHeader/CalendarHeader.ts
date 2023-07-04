import CalendarLabel from "./CalendarLabel";
import CalendarController from "./CalendarController";
import { IEngine, IMediator } from "@/interfaces";

export default class CalendarHeader {
    protected engine: IEngine;
    private mediator: IMediator;

    private containerElm: HTMLElement = document.createElement('div');
    public labelElm: CalendarLabel = new CalendarLabel();
    public controllerElm: CalendarController = new CalendarController();

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

        this.containerElm.classList.add('CalendarYearMonthController');
        this.containerElm.appendChild(this.labelElm.container);
        this.containerElm.appendChild(this.controllerElm.container);

        const currentMonthName = this.engine.getCurrentMonthName().expanded;
        const currentYear = this.engine.getCurrentYear();
        this.labelElm.text = `${currentMonthName} ${currentYear}`;
    }
    
    public get container() {
        return this.containerElm;
    }
}
