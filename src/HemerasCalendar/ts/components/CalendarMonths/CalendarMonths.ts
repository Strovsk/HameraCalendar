import { IEngine, IMediator } from "@/interfaces";

export default class CalendarMonths {
    private mediator: IMediator;
    protected engine: IEngine;

    private containerElm: HTMLElement = document.createElement('div');
    public monthClickEvent: EventListenerOrEventListenerObject | undefined;

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

        this.containerElm.classList.add('CalendarMonthSelection');
    }

    public updateMonths(monthsList: MonthNameObject[]) {
        monthsList.forEach((monthName: MonthNameObject, index: number) => {
            const monthElm = document.createElement('div');
            // monthElm.addEventListener('click', () => {
            //     this.calendarEngine.month = index;
            //     this.insertDatesInScreen(); // REFACTOR mediator.nofityInsertDatesInScreen
            //     this.toggleDatesArea(); // REFACTOR mediator.notifyToggleDatesArea
            // });
            monthElm.innerText = monthName.short;
            this.containerElm.appendChild(monthElm);
        });
    }

    public get container(): HTMLElement {
        return this.containerElm;
    }

    public open() {
        this.containerElm.removeAttribute('close');
        this.containerElm.setAttribute('open', '');
    }

    public close() {
        this.containerElm.removeAttribute('close');
        this.containerElm.setAttribute('open', '');
    }
}
