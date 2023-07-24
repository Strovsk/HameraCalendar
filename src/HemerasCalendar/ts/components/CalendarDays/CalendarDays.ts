import { IEngine, IMediator } from "@/interfaces";

export default class CalendarDays {
    protected engine: IEngine;
    private mediator: IMediator;

    private containerElm: HTMLElement = document.createElement('div');
    public weekdays: Weekday[];

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

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

    public isOpen() {
        return this.containerElm.hasAttribute('open');
    }

    public open(onOpen: CallableFunction | undefined = undefined) {
        this.containerElm.setAttribute('open', '');
        this.containerElm.removeAttribute('close');
        if (onOpen) onOpen();
    }

    public close(onAnimationEnd: CallableFunction | undefined = undefined) {
        this.containerElm.removeAttribute('open');
        this.containerElm.setAttribute('close', '');

        this.containerElm.addEventListener('animationend', (event: AnimationEvent) => {
            const element = event.target as HTMLElement;
            element.removeAttribute('close');
            if (onAnimationEnd) onAnimationEnd();
        }, { once:true });
    }

    public toggle(payload: CallableFunction) {
        if (this.isOpen()) this.close(payload);
        else this.open(payload);
    }
}