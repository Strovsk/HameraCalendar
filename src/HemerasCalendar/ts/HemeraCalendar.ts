import { Config } from '@/config';
import { HemeraCalendarEngine } from '@/HemeraCalendarEngine';
import { objectExtends } from '@/utils/objectExtends';
import { monthsOptions } from '@/helpers/languages';
import { CalendarHeader } from '@/components/CalendarHeader';
import { CalendarDays } from '@/components/CalendarDays';
import { CalendarDates } from '@/components/CalendarDates';

export class HemeraCalendar {
    public options: AppOptions = Config.appOptions;
    public isDatesView: boolean = true;
    public calendarEngine: HemeraCalendarEngine;

    public calendarHeaderElm: CalendarHeader = new CalendarHeader();
    public calendarDays: CalendarDays = new CalendarDays();
    public calendarDates: CalendarDates = new CalendarDates();

    public containerElm: HTMLElement = document.createElement('div');

    public containerCalendarMonthYearElm: HTMLElement = document.createElement('div');

    public containerCalendarActionButtonsElm: HTMLElement = document.createElement('div');
    public actionOkButtonElm: HTMLElement = document.createElement('button');
    public actionCancelButtonElm: HTMLElement = document.createElement('button');

    containerDefaultWidth: pixel = 450;

    constructor(options: AppOptions = Config.appOptions) {
        this.options = objectExtends(this.options, options) as AppOptions;
        this.calendarEngine = new HemeraCalendarEngine(this.options);

        this.loadComponent();
    }

    private defineCalendarDefaultPosition(x: pixel = 50, y: pixel = 50): {x: pixel, y: pixel} {
        const posRefElm = document.querySelector(this.options.container as string);

        if (!posRefElm) throw new Error('Container not exists');

        const refStyles = posRefElm.getBoundingClientRect();

        const positionPresetX: CalendarPositionPresetX = {
            start: Math.round(refStyles.x),
            end: Math.round(refStyles.x + refStyles.width),
            center: Math.round(refStyles.x + (refStyles.width / 2)),
        };

        if (this.options.container) {
            if (posRefElm) {
                const gapTop = this.options.pos?.gapTop as number;
                const gapLeft = this.options.pos?.gapLeft as number;
                const posX = this.options.pos?.x as string;

                let x = ['start', 'end', 'center'].includes(posX)
                    ? positionPresetX[posX as keyof CalendarPositionPresetX]
                    : positionPresetX.center + gapLeft;

                if (x + refStyles.width > window.innerWidth) x = window.innerWidth - this.containerDefaultWidth - 20;

                return { y: Math.round(refStyles.y + refStyles.height + gapTop), x };
            }
        } else if (this.options.pos) {
            return { x: this.options.pos.x as pixel, y: this.options.pos.y as pixel };
        }
        return { x, y };
    }

    private createElementStructure(): void {
        const containerPos = this.defineCalendarDefaultPosition();

        this.containerElm.style.top = containerPos.y + 'px';
        this.containerElm.style.left = containerPos.x + 'px';

        this.calendarDates.open();
        this.calendarDays.open();
        // this.containerCalendarMonthYearElm.setAttribute('close', '');

        this.containerElm.appendChild(this.calendarHeaderElm.container);
        this.containerElm.appendChild(this.calendarDays.container);
        this.containerElm.appendChild(this.calendarDates.container);
        this.containerElm.appendChild(this.containerCalendarMonthYearElm);

        if (!this.mustShowActionButtons())
            this.containerElm.appendChild(this.containerCalendarActionButtonsElm);

        this.calendarDays.updateWeekDays(
            this.calendarEngine.getWeekDays(),
        );

        this.calendarHeaderElm.labelElm.text = `${this.calendarEngine.getCurrentMonthName().expanded} ${this.calendarEngine.getCurrentYear()}`;

        this.containerCalendarActionButtonsElm.setAttribute('open', '');
        this.containerCalendarActionButtonsElm.appendChild(this.actionCancelButtonElm);
        this.containerCalendarActionButtonsElm.appendChild(this.actionOkButtonElm);
    }

    private loadElementStyles(): void {
        this.containerElm.classList.add('Calendar');
        if (this.options.stayOnTop) this.show();

        this.containerCalendarMonthYearElm.classList.add('CalendarMonthSelection');
        this.containerCalendarActionButtonsElm.classList.add('CalendarActionContainer');

        this.actionOkButtonElm.innerText = 'Ok';
        this.actionCancelButtonElm.innerText = 'Cancel';
    }

    private loadEvents(): void {
        const resetDaySelection = () => {
            if (!this.calendarEngine.isRangeDefined()) this.calendarDates.resetSubselections();
        };

        this.calendarDates.container.addEventListener('mouseleave', resetDaySelection);
        this.containerElm.addEventListener('mouseleave', resetDaySelection);

        this.calendarHeaderElm.labelElm.container.addEventListener('click', () => {
            this.toggleDatesArea();
            console.log('clicado');
        });

        this.calendarHeaderElm.controllerElm.nextYearMonthElm.addEventListener('click', () => {
            if (this.isDatesView)
                this.monthController(1, 'add');
            else this.yearController(1, 'add');
        });
        this.calendarHeaderElm.controllerElm.prevYearMonthElm.addEventListener('click', () => {
            if (this.isDatesView)
                this.monthController(1, 'remove');
            else this.yearController(1, 'remove');
        });

        this.actionOkButtonElm.addEventListener('click', (event) => {
            if (!this.options.onConfirm) throw new Error('On confirm function not defined');

            this.options.onConfirm(this.calendarEngine.selections, event);
            this.hide();
        });

        this.actionCancelButtonElm.addEventListener('click', (event) => {
            if (!this.options.onCancel) throw new Error('On cancel function not defined');

            this.options.onCancel(this.calendarEngine.selections, event);
            this.hide();
        });
    }

    private loadComponent() {
        this.createElementStructure();
        this.loadElementStyles();
    
        this.insertDatesInScreen();
        this.insertMonthsInScreen();
        this.loadEvents();

        if (this.options.init) this.init();
    }

    public mustShowActionButtons() {
        return this.options.closeAfterSelect || !this.options.stayOnTop;
    }

    public init() {
        document.body.appendChild(this.containerElm);
    }

    public monthController(monthQtd = 1, option: keyof MonthContollerOptions = 'add') {
        const options: MonthContollerOptions = {
            add: () => this.calendarEngine.addMonth(monthQtd),
            remove: () => this.calendarEngine.removeMonth(monthQtd),
        };

        options[option]();

        const monthName = this.calendarEngine.getCurrentMonthName().expanded;
        const year = this.calendarEngine.getCurrentYear()

        this.calendarHeaderElm.labelElm.text = `${monthName} ${year}`;
        this.insertDatesInScreen();
    }

    public yearController(yearQtd = 1, option: keyof YearContollerOptions = 'add') {
        const options = {
            'add': () => this.calendarEngine.addYear(yearQtd),
            'remove': () => this.calendarEngine.removeYear(yearQtd),
        };

        options[option]();

        const year = this.calendarEngine.getCurrentYear()

        this.calendarHeaderElm.labelElm.text = `${year}`;
        this.insertDatesInScreen();
    }

    public insertMonthsInScreen() {
        const language = this.options.language as keyof typeof monthsOptions;
        this.calendarEngine.monthsOptions[language].forEach(
            (monthName: MonthNameObject, index: number) => {
                const monthElm = document.createElement('div');
                monthElm.addEventListener('click', () => {
                    this.calendarEngine.month = index;
                    this.insertDatesInScreen();
                    this.toggleDatesArea();
            }
        );
            monthElm.innerText = monthName.short;
            this.containerCalendarMonthYearElm.appendChild(monthElm);
        });
    }

    public insertDatesInScreen() {
        const dateClickEvent = (event: MouseEvent) => {
            if (!event.target) return;
            const targetElement = event.target as HTMLElement;

            const month = parseInt(targetElement.getAttribute('month') as string, 10);
            const year = parseInt(targetElement.getAttribute('year') as string, 10);
            const date = parseInt(targetElement.innerText, 10);

            if (this.calendarEngine.mustResetSelection()) this.calendarDates.resetSelections();
            const isSelected = this.calendarEngine.toggleDateSelection(year, month, date);
            if (isSelected) {
                targetElement.classList.add('--selected'); // REFACTOR to object dateNode instance
                if (this.options.onSelect) {
                    this.options.onSelect({
                        year, month, date,
                        isToday: targetElement.classList.contains('--today'),
                        isAnotherMonth: targetElement.classList.contains('--anotherMonth'),
                        dateObj: new Date(year, month, date),
                        target: targetElement,
                    });
                }
            }
            else {
                targetElement.classList.remove('--selected');
                if (isMobileDevice()) this.calendarDates.resetSubselections();
            };

            if (this.calendarEngine.mustClose()) setTimeout(() => this.hide(), 300);
        };

        const dateMouseHoverEvent = (event: MouseEvent) => {
            if (!event.target) return;
            const targetElement = event.target as HTMLElement;
            const month = parseInt(targetElement.getAttribute('month') as string, 10);
            const year = parseInt(targetElement.getAttribute('year') as string, 10);
            const date = parseInt(targetElement.innerText, 10);

            if (!this.calendarEngine.isSubSelectingRangeMode()) return;

            this.selectRange(year, month, date);
        };

        this.calendarDates.updateDates(this.calendarEngine.getArrayDate());
        this.calendarDates.dateNodeClickEvent.push(dateClickEvent as EventListenerOrEventListenerObject);
        this.calendarDates.dateNodeHoverEvent.push(dateMouseHoverEvent as EventListenerOrEventListenerObject);
    }

    public selectRange(limitYear: Year, limitMonth: Month, limitDate: MonthDate) {
        this.calendarDates.dateNodes.forEach((dateObj) => {
            const toCompare = {
                date: dateObj.date,
                month: dateObj.month,
                year: dateObj.year,
            };
            const comparisonLimit = { date: limitDate, month: limitMonth, year: limitYear };

            dateObj.enableSubSelectedStyle = this.calendarEngine
                .isDateSubSelectingRangeMode(toCompare, comparisonLimit);
        });
    };
    
    public resetRange() {
        console.log('Executando reset de range');
        if (this.calendarEngine.isRangeDefined()) return;
    private isMobileDevice() {
        const isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
            },
        };

        return (
            isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()
        );
        this.calendarDates.resetSubselections();
    }

    public show() {
        console.log('show element');
        this.containerElm.removeAttribute('close');
        this.containerElm.setAttribute('open', '');
    }

    public hide() {
        console.log('hide element');
        this.containerElm.removeAttribute('open');
        this.containerElm.setAttribute('close', '');
        this.containerElm.addEventListener('animationend', () => {
            this.containerElm.removeAttribute('close');
            console.log('animação acabou');
        }, { once: true});
        this.insertDatesInScreen();
    }

    public toggle() {
        console.log('toggle element', this.containerElm.hasAttribute('open'));
        if (this.containerElm.hasAttribute('open')) this.hide();
        else this.show();
    }

    public hideDatesArea() {
        const onAnimationEnd = (event: AnimationEvent) => {
            console.log('animação de fechar o calendario acabou');
            const element = event.target as HTMLElement;
            element.removeAttribute('close');
        };

        this.isDatesView = false;

        this.calendarDates.close();
        this.calendarDates.container.addEventListener('animationend', (event) => {
            onAnimationEnd(event);
            this.showMonthsArea();
        }, { once: true});
        
        this.calendarDays.close();
        this.calendarDays.container.addEventListener('animationend', onAnimationEnd, { once: true});
        
        this.containerCalendarActionButtonsElm.setAttribute('close', '');
        this.containerCalendarActionButtonsElm.removeAttribute('open');
        this.containerCalendarActionButtonsElm.addEventListener('animationend', onAnimationEnd, { once: true});
    }

    public showDatesArea() {
        this.calendarHeaderElm.labelElm.text = `${this.calendarEngine.getCurrentMonthName().expanded} ${this.calendarEngine.getCurrentYear()}`;

        this.isDatesView = true;

        this.calendarDates.open();
        this.calendarDays.open();

        this.containerCalendarActionButtonsElm.setAttribute('open', '');
        this.containerCalendarActionButtonsElm.removeAttribute('close');
    }

    public toggleDatesArea() {
        if (this.calendarDates.isOpen()) {
            this.hideDatesArea();
            console.log('fechando calendário');
        }
        else {
            console.log('abrindo calendário');
            this.hideMonthsArea();
        }
    }

    public showMonthsArea() {
        this.calendarHeaderElm.labelElm.text = `${this.calendarEngine.currentMonthYear.year}`;
        this.containerCalendarMonthYearElm.setAttribute('open', '');
        this.containerCalendarMonthYearElm.removeAttribute('close');
    }

    public hideMonthsArea() {
        const onAnimationEnd = (event: AnimationEvent) => {
            console.log('animação de abrir o calendario acabou');
            (event.target as HTMLElement).removeAttribute('close');
            this.showDatesArea();
        };

        this.containerCalendarMonthYearElm.setAttribute('close', '');
        this.containerCalendarMonthYearElm.removeAttribute('open');
        this.containerCalendarMonthYearElm.addEventListener('animationend', onAnimationEnd, { once: true});
    }
}
