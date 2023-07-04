import { IEngine, IMediator } from "@/interfaces";

export default class CalendarDays {
    protected engine: IEngine;
    private mediator: IMediator;

    private containerElm: HTMLElement = document.createElement('div');
    public weekdays: Weekday[];

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

        this.open();

        this.weekdays = this.engine.getWeekDays();
        this.updateWeekDays(this.weekdays);

        this.containerElm.classList.add('CalendarDays');
    }

    get container() {
        return this.containerElm;
    }

    public updateWeekDays(value: Weekday[]) {
        this.weekdays = value;
        value.forEach((weekday: Weekday) => {
            const weekDayElm = document.createElement('h3');
            weekDayElm.innerText = weekday;
            this.containerElm.appendChild(weekDayElm);
        });
    }

    public open() {
        this.containerElm.setAttribute('open', '');
        this.containerElm.removeAttribute('close');
    }

    public close() {
        this.containerElm.setAttribute('close', '');
        this.containerElm.removeAttribute('open');
    }
}