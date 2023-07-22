import CalendarLabel from "./CalendarLabel";
import CalendarController from "./CalendarController";
import { IEngine, IMediator } from "@/interfaces";

export default class CalendarHeader {
    protected engine: IEngine;
    private mediator: IMediator;

    private containerElm: HTMLElement = document.createElement('div');
    public controllerElm: CalendarController;
    public labelElm: CalendarLabel = new CalendarLabel();

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

        this.controllerElm = new CalendarController(engine, mediator);

        this.containerElm.classList.add('CalendarYearMonthController');
        this.containerElm.appendChild(this.labelElm.container);
        this.containerElm.appendChild(this.controllerElm.container);

        this.updateLabel();
    }
    
    public get container() {
        return this.containerElm;
    }

    public updateLabel() {
        const currentMonthName = this.engine.getCurrentMonthName().expanded;
        const currentYear = this.engine.getCurrentYear();
        this.labelElm.text = `${currentMonthName} ${currentYear}`;
    }
}
