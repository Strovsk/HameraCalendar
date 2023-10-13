import { IEngine, IMediator } from "@/interfaces";

export default class CalendarController {
    public containerElm: HTMLElement = document.createElement('div');
    public prevYearMonthElm: HTMLElement = document.createElement('button');
    public nextYearMonthElm: HTMLElement = document.createElement('button');

    protected engine: IEngine;
    private mediator: IMediator;

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;
        
        this.containerElm.appendChild(this.prevYearMonthElm);
        this.containerElm.appendChild(this.nextYearMonthElm);

        this.prevYearMonthElm.classList.add(
            'CalendarYearMonthController-button',
            '--previous',
        );

        this.nextYearMonthElm.classList.add(
            'CalendarYearMonthController-button',
            '--next',
        );
        this.containerElm.classList.add(
            'CalendarYearMonthController-buttonConatiner',
        );

        this.nextYearMonthElm.addEventListener('click', () => this.onRightClickEvent());
        this.prevYearMonthElm.addEventListener('click', () => this.onLeftClickEvent());
    }

    private onRightClickEvent() {
        if (this.mediator.states.isDatesView) this.engine.addMonth(1);
        else this.engine.addYear(1);

        if (!this.engine.hasSelectionsInCurrentMonth() && this.engine.selections.length > 0)
            this.mediator.notify(this, 'datePin', 'open');
        else
            this.mediator.notify(this, 'datePin', 'close');

        this.mediator.notify(this, 'dates', 'updateDates');
        this.mediator.notify(this, 'header', 'updateLabel');
    }
    
    private onLeftClickEvent() {
        if (this.mediator.states.isDatesView) this.engine.removeMonth(1);
        else this.engine.removeYear(1);

        if (!this.engine.hasSelectionsInCurrentMonth() && this.engine.selections.length > 0)
            this.mediator.notify(this, 'datePin', 'open');
        else
            this.mediator.notify(this, 'datePin', 'close');

        this.mediator.notify(this, 'dates', 'updateDates');
        this.mediator.notify(this, 'header', 'updateLabel');
    }

    public get container() {
        return this.containerElm;
    }
}