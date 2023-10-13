import { IEngine, IMediator } from "@/interfaces";

export default class CalendarSelectionPin {
    private mediator: IMediator;
    protected engine: IEngine;

    private containerElm: HTMLElement = document.createElement('div');
    private dayElm: HTMLElement = document.createElement('div');
    private monthElm: HTMLElement = document.createElement('div');
    private yearElm: HTMLElement = document.createElement('div');
    public monthClickEvent: EventListenerOrEventListenerObject | undefined;

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

        this.containerElm.classList.add('CalendarSelectionPinContainer');

        this.dayElm.classList.add('CalendarSelectionPinDay');
        this.monthElm.classList.add('CalendarSelectionPinMonth');
        this.yearElm.classList.add('CalendarSelectionPinYear');

        this.containerElm.addEventListener('click', (event: MouseEvent) => this.onContainerClickEvent(event));

        this.containerElm.appendChild(this.monthElm);
        this.containerElm.appendChild(this.dayElm);
        this.containerElm.appendChild(this.yearElm);
    }

    public get container(): HTMLElement {
        return this.containerElm;
    }

    public isOpen() {
        return this.containerElm.hasAttribute('open');
    }

    public open() {
        const { date, year, month: monthIndex } = this.engine.selections[0];
        const month = this.engine.getMonths()[monthIndex].short;
        this.setDate({ date, year, month });
        this.containerElm.removeAttribute('close');
        this.containerElm.setAttribute('open', '');
    }

    public close() {
        this.containerElm.setAttribute('close', '');
        this.containerElm.removeAttribute('open');

        this.containerElm.addEventListener('animationend', (event: AnimationEvent) => {
            const element = event.target as HTMLElement;
            element.removeAttribute('close');
        }, { once: true });
    }

    public toggle(_payload: CallableFunction) {
        if (this.isOpen()) this.close();
        else this.open();
    }

    public setDate(newDate: DateMinimalObj) {
        this.dayElm.innerText = `${newDate.date}`;
        this.monthElm.innerText = `${newDate.month}`;
        this.yearElm.innerText = `${newDate.year}`;
    }

    private onContainerClickEvent(_event: MouseEvent) {
        const { month, year } = this.engine.selections[0];
        this.engine.month = month
        this.engine.year = year;
        this.mediator.notify(this, 'dates', 'updateDates');
        this.close();
    }
}
