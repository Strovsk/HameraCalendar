export default class DateNode {
    private containerElm: HTMLElement = document.createElement('div');
    public date: MonthDate;
    public month: Month;
    public year: Year;

    constructor(index: number, dateInfo: DateInfo) {
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
}