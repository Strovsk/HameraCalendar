import { IEngine, IMediator } from '@/interfaces';

export default class CalendarMonths {
  private mediator: IMediator;
  protected engine: IEngine;

  private containerElm: HTMLElement = document.createElement('div');
  public monthClickEvent: EventListenerOrEventListenerObject | undefined;

  constructor(engine: IEngine, mediator: IMediator) {
    this.engine = engine;
    this.mediator = mediator;

    this.containerElm.classList.add('CalendarMonthSelection');
    this.updateMonths();
  }

  public updateMonths() {
    this.engine
      .getMonths()
      .forEach((monthName: MonthNameObject, index: number) => {
        const monthElm = document.createElement('div');
        monthElm.addEventListener('click', () => {
          this.engine.month = index;
          this.mediator.notify(this, 'dates', 'updateDates');
          if (this.mediator.states.isDatesView) {
            this.mediator.notify(this, 'days', 'toggle');
            this.mediator.notify(this, 'dates', 'toggle');
          } else {
            this.mediator.notify(this, 'months', 'toggle');
          }
        });
        monthElm.innerText = monthName.short;
        this.containerElm.appendChild(monthElm);
      });
  }

  public get container(): HTMLElement {
    return this.containerElm;
  }

  public isOpen() {
    return this.containerElm.hasAttribute('open');
  }

  public open() {
    this.containerElm.removeAttribute('close');
    this.containerElm.setAttribute('open', '');
  }

  public close() {
    this.containerElm.setAttribute('close', '');
    this.containerElm.removeAttribute('open');

    this.containerElm.addEventListener(
      'animationend',
      (event: AnimationEvent) => {
        (event.target as HTMLElement).removeAttribute('close');
        this.containerElm.removeAttribute('close');
        this.mediator.notify(this, 'dates', 'open');
        this.mediator.notify(this, 'days', 'open');
      },
      { once: true }
    );
  }

  public toggle(payload: CallableFunction) {
    if (this.isOpen()) this.close();
    else this.open();
  }
}
