import { IEngine, IMediator } from "@/interfaces";
import DateNode from "./DateNode";

export default class CalendarDates {
    private containerElm: HTMLElement = document.createElement('div');
    public dateNodeClickEvent: EventListenerOrEventListenerObject[] = [];
    public dateNodeHoverEvent: EventListenerOrEventListenerObject[] = [];
    public dateNodes: DateNode[] = [];

    protected engine: IEngine;
    private mediator: IMediator;

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

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

    public updateDates() { // Old insertDatesInScreen
        this.containerElm.innerHTML = '';
        this.engine.getArrayDate().forEach((dateObj, index) => {
            const dateElm = new DateNode(index, dateObj, this.engine, this.mediator);

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

    public selectRange(limitDate: DateMinimalObj) {
        this.dateNodes.forEach((dateObj) => {
            const toCompare: DateMinimalObj = {
                date: dateObj.date,
                year: dateObj.year,
                month: dateObj.month,
            };
            const comparisonLimit: DateMinimalObj = {
                date: limitDate.date,
                year: limitDate.year,
                month: limitDate.month,
            };

            const mustBeSubselected = this.engine
                .isDateSubSelectingRangeMode(toCompare, comparisonLimit);
            dateObj.enableSubSelectedStyle = mustBeSubselected;
        });
    }
}
