import { IEngine, IMediator } from "@/interfaces";

export default class CalendarLabel {
    public containerElm: HTMLElement = document.createElement('button');
    private _text: string;

    protected engine: IEngine;
    private mediator: IMediator;

    constructor(text: string = '', engine: IEngine, mediator: IMediator) {
        this._text = text;
        this.containerElm.innerText = this._text;

        this.engine = engine;
        this.mediator = mediator;

        this.loadContainerStyle();

        this.containerElm.addEventListener('click', () => this.onClickLabel());
    }

    private loadContainerStyle() {
        this.containerElm.classList.add('CalendarMonthYear');
    }

    public set text(value: string) {
        this._text = value;
        this.containerElm.innerText = this._text;
    }

    public get container() {
        return this.containerElm;
    }

    private onClickLabel() {
        if (this.mediator.states.isDatesView) {
            this.mediator.notify(this, 'days', 'toggle');
            this.mediator.notify(this, 'dates', 'toggle');
        }
        else {
            this.mediator.notify(this, 'months', 'toggle');
        }
    }
}