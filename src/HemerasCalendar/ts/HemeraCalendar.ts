import { Config } from '@/config';
import HemeraCalendarEngine from '@/HemeraCalendarEngine';
import { objectExtends } from '@/utils/objectExtends';
import { monthsOptions } from 'helpers/languages';

export default class HemeraCalendar {
    public options: AppOptions = Config.appOptions;
    public isDatesView: boolean = true;
    public calendarEngine: HemeraCalendarEngine;

    public containerElm: HTMLElement = document.createElement('div');
    public containerYearMonthElm: HTMLElement = document.createElement('div');
    public buttonsContainerYearMonthElm: HTMLElement = document.createElement('div');
    public yearMonthElm: HTMLElement = document.createElement('button');
    public prevYearMonthElm: HTMLElement = document.createElement('button');
    public nextYearMonthElm: HTMLElement = document.createElement('button');
    public containerCalendarDays: HTMLElement = document.createElement('div');
    public containerCalendarDatesElm: HTMLElement = document.createElement('div');

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

        this.containerCalendarDatesElm.setAttribute('open', '');
        this.containerCalendarDays.setAttribute('open', '');
        // this.containerCalendarMonthYearElm.setAttribute('close', '');

        this.containerElm.appendChild(this.containerYearMonthElm);
        this.containerElm.appendChild(this.containerCalendarDays);
        this.containerElm.appendChild(this.containerCalendarDatesElm);
        this.containerElm.appendChild(this.containerCalendarMonthYearElm);

        if (!this.mustShowActionButtons())
            this.containerElm.appendChild(this.containerCalendarActionButtonsElm);

        this.containerYearMonthElm.appendChild(this.yearMonthElm);
        this.containerYearMonthElm.appendChild(
            this.buttonsContainerYearMonthElm
        );
        this.buttonsContainerYearMonthElm.appendChild(this.prevYearMonthElm);
        this.buttonsContainerYearMonthElm.appendChild(this.nextYearMonthElm);

        this.calendarEngine.getWeekDays().forEach((weekday: Weekday) => {
            const weekDayElm = document.createElement('h3');
            weekDayElm.innerText = weekday;
            this.containerCalendarDays.appendChild(weekDayElm);
        });
        this.yearMonthElm.innerText = `${this.calendarEngine.getCurrentMonthName().expanded} ${this.calendarEngine.getCurrentYear()}`;

        this.containerCalendarActionButtonsElm.setAttribute('open', '');
        this.containerCalendarActionButtonsElm.appendChild(this.actionCancelButtonElm);
        this.containerCalendarActionButtonsElm.appendChild(this.actionOkButtonElm);
    }

    private loadElementStyles(): void {
        this.containerElm.classList.add('Calendar');
        if (this.options.stayOnTop) this.show();

        this.containerYearMonthElm.classList.add('CalendarYearMonthController');
        this.buttonsContainerYearMonthElm.classList.add('CalendarYearMonthController-buttonContainer');
        this.prevYearMonthElm.classList.add(
            'CalendarYearMonthController-button',
            '--previous'
        );
        this.nextYearMonthElm.classList.add(
            'CalendarYearMonthController-button',
            '--next'
        );
        this.yearMonthElm.classList.add('CalendarMonthYear');

        this.containerCalendarDays.classList.add('CalendarDays');
        this.containerCalendarDatesElm.classList.add('CalendarDates');

        this.containerCalendarMonthYearElm.classList.add('CalendarMonthSelection');
        this.containerCalendarActionButtonsElm.classList.add('CalendarActionContainer');

        this.actionOkButtonElm.innerText = 'Ok';
        this.actionCancelButtonElm.innerText = 'Cancel';
    }

    private loadEvents(): void {
        const resetDaySelection = () => {
            if (!this.calendarEngine.isRangeDefined()) this.resetRange();
        };

        this.containerCalendarDatesElm.addEventListener('mouseleave', resetDaySelection);
        this.containerElm.addEventListener('mouseleave', resetDaySelection);

        this.yearMonthElm.addEventListener('click', () => {
            this.toggleDatesArea();
            console.log('clicado');
        });

        this.nextYearMonthElm.addEventListener('click', () => {
            if (this.isDatesView)
                this.monthController(1, 'add');
            else this.yearController(1, 'add');
        });
        this.prevYearMonthElm.addEventListener('click', () => {
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

    public setYearMonth(text: string) {
        // TODO transform it in a getter
        // REFACTOR subsitute all this.yearmonthElm.innerText for this function
        this.yearMonthElm.innerText = text;
    }

    public setMonthYearToCurrent() {
        // TODO transform it in a setter
        this.yearMonthElm.innerText = `${this.calendarEngine.getCurrentMonthName().expanded} ${this.calendarEngine.getCurrentYear()}`;
    }

    public monthController(monthQtd = 1, option: keyof MonthContollerOptions = 'add') {
        const options: MonthContollerOptions = {
            add: () => this.calendarEngine.addMonth(monthQtd),
            remove: () => this.calendarEngine.removeMonth(monthQtd),
        };

        options[option]();

        const monthName = this.calendarEngine.getCurrentMonthName().expanded;
        const year = this.calendarEngine.getCurrentYear()

        this.yearMonthElm.innerText = `${monthName} ${year}`;
        this.insertDatesInScreen();
    }

    public yearController(yearQtd = 1, option: keyof YearContollerOptions = 'add') {
        const options = {
            'add': () => this.calendarEngine.addYear(yearQtd),
            'remove': () => this.calendarEngine.removeYear(yearQtd),
        };

        options[option]();

        const year = this.calendarEngine.getCurrentYear()

        this.yearMonthElm.innerText = `${year}`;
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
        this.containerCalendarDatesElm.innerHTML = '';

        const dateClickEvent = (event: MouseEvent) => {
            if (!event.target) return;
            const targetElement = event.target as HTMLElement;

            const month = parseInt(targetElement.getAttribute('month') as string, 10);
            const year = parseInt(targetElement.getAttribute('year') as string, 10);
            const date = parseInt(targetElement.innerText, 10);

            if (this.calendarEngine.mustResetSelection()) this.resetSelection();
            const isSelected = this.calendarEngine.toggleDateSelection(year, month, date);
            if (isSelected) {
                targetElement.classList.add('--selected');
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
                if (this.isMobileDevice()) this.resetRange();
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

        this.calendarEngine.getArrayDate().forEach((dateObj, index) => {
            const dateElm = document.createElement('div');
            dateElm.innerText = String(dateObj.date);
            dateElm.classList.add('calendarDate');
            dateElm.addEventListener('click', dateClickEvent);
            dateElm.addEventListener('mouseenter', dateMouseHoverEvent);
            dateElm.setAttribute('index', String(index));
            dateElm.setAttribute('date', String(dateObj.date));
            dateElm.setAttribute('month', String(dateObj.month));
            dateElm.setAttribute('year', String(dateObj.year));

            if (dateObj.isAnotherMonth)
                dateElm.classList.add('--anotherMonth');

            if (dateObj.isSelected)
                dateElm.classList.add('--selected');

            if (dateObj.isToday)
                dateElm.classList.add('--today');

            if (dateObj.isSubSelected)
                dateElm.classList.add('--sub-selected');

            this.containerCalendarDatesElm.appendChild(dateElm);
        });
    }

    public selectRange(limitYear: Year, limitMonth: Month, limitDate: MonthDate) {
        Array.from(
            this.containerCalendarDatesElm.children
        ).forEach((dateElm) => {
            const toCompareMonth = parseInt(dateElm.getAttribute('month') as string, 10);
            const toCompareYear = parseInt(dateElm.getAttribute('year') as string, 10);
            const toCompareDate = parseInt((dateElm as HTMLElement).innerText, 10);

            const toCompare = { date: toCompareDate, month: toCompareMonth, year: toCompareYear };
            const comparisonLimit = { date: limitDate, month: limitMonth, year: limitYear };

            if (this.calendarEngine.isDateSubSelectingRangeMode(toCompare, comparisonLimit))
                dateElm.classList.add('--sub-selected');
            else
                dateElm.classList.remove('--sub-selected');
        });
    };
    
    public resetRange() {
        console.log('Executando reset de range');
        if (this.calendarEngine.isRangeDefined()) return;
        Array.from(
            this.containerCalendarDatesElm.children
        ).forEach((dateElm) => {
            dateElm.classList.remove('--sub-selected');
        });
    }

    public resetSelection() {
        console.log('Iniciando resetar seleção');
        Array.from(
            this.containerCalendarDatesElm.children
        ).forEach((dateElm) => {
            if (dateElm.classList.contains('--selected'))
                dateElm.classList.remove('--selected');
        });
    }

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

        this.containerCalendarDatesElm.setAttribute('close', '');
        this.containerCalendarDatesElm.removeAttribute('open');
        this.containerCalendarDatesElm.addEventListener('animationend', (event) => {
            onAnimationEnd(event);
            this.showMonthsArea();
        }, { once: true});
        
        this.containerCalendarDays.setAttribute('close', '');
        this.containerCalendarDays.removeAttribute('open');
        this.containerCalendarDays.addEventListener('animationend', onAnimationEnd, { once: true});
        
        this.containerCalendarActionButtonsElm.setAttribute('close', '');
        this.containerCalendarActionButtonsElm.removeAttribute('open');
        this.containerCalendarActionButtonsElm.addEventListener('animationend', onAnimationEnd, { once: true});
    }

    public showDatesArea() {
        this.setMonthYearToCurrent();

        this.isDatesView = true;

        this.containerCalendarDatesElm.removeAttribute('close');
        this.containerCalendarDatesElm.setAttribute('open', '');

        this.containerCalendarDays.removeAttribute('close');
        this.containerCalendarDays.setAttribute('open', '');

        this.containerCalendarActionButtonsElm.setAttribute('open', '');
        this.containerCalendarActionButtonsElm.removeAttribute('close');
    }

    public toggleDatesArea() {
        if (this.containerCalendarDatesElm.hasAttribute('open')) {
            this.hideDatesArea();
            console.log('fechando calendário');
        }
        else {
            console.log('abrindo calendário');
            this.hideMonthsArea();
        }
    }

    public showMonthsArea() {
        this.setYearMonth(`${this.calendarEngine.currentMonthYear.year}`);
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
