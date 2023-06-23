export default class CalendarDays {
    private containerElm: HTMLElement = document.createElement('div');
    public weekdays: Weekday[];

    constructor(weekdays: Weekday[] | undefined = undefined) {
        this.containerElm.setAttribute('open', '');

        this.weekdays = weekdays ?? [];
        if (typeof weekdays === 'object')
            this.updateWeekDays(weekdays);

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