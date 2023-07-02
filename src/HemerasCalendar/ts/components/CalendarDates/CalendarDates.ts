import DateNode from "./DateNode";

export default class CalendarDates {
    private containerElm: HTMLElement = document.createElement('div');
    public dateNodeClickEvent: EventListenerOrEventListenerObject[] = [];
    public dateNodeHoverEvent: EventListenerOrEventListenerObject[] = [];
    public dateNodes: DateNode[] = [];

    constructor() {
        this.containerElm.classList.add('CalendarDates');
    }

    public open() {
        this.containerElm.removeAttribute('close');
        this.containerElm.setAttribute('open', '');
    }

    public isOpen() {
        return this.containerElm.hasAttribute('open');
    }

    public close() {
        this.containerElm.removeAttribute('open');
        this.containerElm.setAttribute('close', '');
    }

    public resetSubselections() { // Old resetRange
        Array.from(
            this.containerElm.children
        ).forEach((dateElm) => {
            dateElm.classList.remove('--sub-selected');
        });
    }
    
    public resetSelections() {
        Array.from(
            this.containerElm.children
        ).forEach((dateElm) => {
            dateElm.classList.remove('--selected');
        });
    }

    public updateDates(datesList: DateInfo[]) { // Old insertDatesInScreen
        this.containerElm.innerHTML = '';
        datesList.forEach((dateObj, index) => {
            const dateElm = new DateNode(index, dateObj);

            this.dateNodeClickEvent?.forEach(func => {
                dateElm.container.addEventListener('click', func);
            });

            this.dateNodeHoverEvent?.forEach(func => {
                dateElm.container.addEventListener('mouseenter', func);
            });

            this.containerElm.appendChild(dateElm.container);
            this.dateNodes.push(dateElm);
        });
    }

    public get container() {
        return this.containerElm;
    }
}