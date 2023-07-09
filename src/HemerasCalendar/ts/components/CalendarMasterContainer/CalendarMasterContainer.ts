import { IEngine, IMediator } from "@/interfaces";

export default class CalendarMasterContainer {
    private containerElm: HTMLElement = document.createElement('div');
    protected engine: IEngine;
    private mediator: IMediator;

    constructor(engine: IEngine, mediator: IMediator) {
        this.engine = engine;
        this.mediator = mediator;

        this.containerElm.classList.add('Calendar');

        this.containerElm.addEventListener('mouseleave', () => this.onMouseLeaveEvent());
    }

    get container() {
        return this.containerElm;
    }

    get isOpen() {
        return this.containerElm.hasAttribute('open');
    }

    set posX(value: pixel) {
        this.containerElm.style.left = value + 'px';
    }

    set posY(value: pixel) {
        this.containerElm.style.top = value + 'px';
    }

    private onMouseLeaveEvent() {
        if (!this.engine.isRangeDefined())
            this.mediator.notify(this, 'dates', 'resetSubselections');
    }

    public init() {
        document.body.appendChild(this.containerElm);
        this.mediator.notify(this, 'dates', 'updateDates');
    }

    public toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    public open() {
        this.containerElm.setAttribute('open', '');
        this.containerElm.removeAttribute('close');

        this.mediator.notify(this, 'dates', 'open');
        this.mediator.notify(this, 'days', 'open');
    }

    public close() {
        this.containerElm.setAttribute('close', '');
        this.containerElm.removeAttribute('open');
        this.containerElm.addEventListener('animationend', () => {
            this.containerElm.removeAttribute('close');
            console.log('animação acabou');
        }, { once: true});
        this.mediator.notify(this, 'dates', 'updateDates');
    }
}
