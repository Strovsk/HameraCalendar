import { IEngine, IMediator } from "@/interfaces";
import debounce from "@/utils/debounce";

export default class DateNode {
    protected engine: IEngine;
    private mediator: IMediator;

    private containerElm: HTMLElement = document.createElement('div');
    public date: MonthDate;
    public month: Month;
    public year: Year;

    constructor(index: number, dateInfo: DateInfo, engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

        this.containerElm.classList.add('calendarDate'); // REFACTOR: change CSS classname to CalendarNode
        this.container.innerText = String(dateInfo.date);
        this.containerElm.setAttribute('index', String(index));
        this.containerElm.setAttribute('date', String(dateInfo.date));
        this.containerElm.setAttribute('month', String(dateInfo.month));
        this.containerElm.setAttribute('year', String(dateInfo.year));

        this.enableAnotherMonthStyle = dateInfo.isAnotherMonth;
        this.enableSelectedStyle = dateInfo.isSelected;
        this.enableTodayStyle = dateInfo.isToday;
        this.enableSubSelectedStyle = dateInfo.isSubSelected;

        this.date = dateInfo.date;
        this.month = dateInfo.month;
        this.year = dateInfo.year;

        this.containerElm.addEventListener('click', () => this.onClickEvent());
        this.containerElm.addEventListener(
            'mouseenter', debounce((event) => this.onMouseHoverEvent(event)),
        );
    }

    public get container() {
        return this.containerElm;
    }

    private enableStyle(styleCSSName: string, mustBeEnabled: boolean) {
        if (mustBeEnabled) this.containerElm.classList.add(styleCSSName);
        else this.containerElm.classList.remove(styleCSSName);
    }

    public set enableAnotherMonthStyle(value: boolean) {
        this.enableStyle('--anotherMonth', value);
    }

    public set enableSelectedStyle(value: boolean) {
        this.enableStyle('--selected', value);
    }

    public set enableTodayStyle(value: boolean) {
        this.enableStyle('--today', value);
    }

    public set enableSubSelectedStyle(value: boolean) {
        this.enableStyle('--sub-selected', value);
    }

    private onClickEvent() {
        this.enableSelectedStyle = this.engine.canSelectDate();
        this.engine.selectDate(this.year, this.month, this.date);
    }

    private onMouseHoverEvent(event: MouseEvent) {
        if (!event.target) return;
        const targetElement = event.target as HTMLElement;
        const month = parseInt(targetElement.getAttribute('month') as string, 10);
        const year = parseInt(targetElement.getAttribute('year') as string, 10);
        const date = parseInt(targetElement.innerText, 10);

        if (!this.engine.isSubSelectingRangeMode()) return;

        this.mediator.notify(this, 'dates', 'selectRange', { date, year, month });
    }
}