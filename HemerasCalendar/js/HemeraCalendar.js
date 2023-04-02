class Calendar {
    constructor(options = {}) {
        this.options = {
            language: 'pt-br',
            static: false,
            container: undefined,
            pos: undefined, // undefined | { x: number, y: number }
            selectionType: 'range',
            markCurrenDay: true,
            ...options,
        };

        this.calendarEngine = new HemeraCalendarEngine(options);

        this.containerElm;
        this.containerYearMonthElm;
        this.buttonsContainerYearMonthElm;
        this.yearMonthElm;
        this.prevYearMonthElm;
        this.nextYearMonthElm;
        this.containerCalendarDays;
        this.containerCalendarDatesElm;

        this.loadComponent();
    }

    createElements() {
        this.containerElm = document.createElement('div');

        this.containerYearMonthElm = document.createElement('div');
        this.buttonsContainerYearMonthElm = document.createElement('div');
        this.prevYearMonthElm = document.createElement('button');
        this.yearMonthElm = document.createElement('button');
        this.nextYearMonthElm = document.createElement('button');

        this.containerCalendarDays = document.createElement('div');
        this.containerCalendarDatesElm = document.createElement('div');
    }

    _defineCalendarDefaultPosition(x = 50, y = 50) {
        if (this.options.container) {
            const posRefElm = document.querySelector(this.options.container);
            if (posRefElm) {
                const refStyles = posRefElm.getBoundingClientRect();
                console.log('top', refStyles);
                const gapLeft = 0;
                const gapTop = 20;
                return {
                    y: Math.round(refStyles.y + refStyles.height + gapTop),
                    x: Math.round(refStyles.x + (refStyles.width / 2) + gapLeft),
                };
            }
        } else if (this.options.pos) {
            return { x: this.options.pos.x, y: this.options.pos.y };
        }
        return { x, y };
    }

    createElementStructure() {
        const containerPos = this._defineCalendarDefaultPosition();
        this.containerElm.style.top = containerPos.y + 'px';
        this.containerElm.style.left = containerPos.x + 'px';

        this.containerElm.appendChild(this.containerYearMonthElm);
        this.containerElm.appendChild(this.containerCalendarDays);
        this.containerElm.appendChild(this.containerCalendarDatesElm);

        this.containerYearMonthElm.appendChild(this.yearMonthElm);
        this.containerYearMonthElm.appendChild(
            this.buttonsContainerYearMonthElm
        );
        this.buttonsContainerYearMonthElm.appendChild(this.prevYearMonthElm);
        this.buttonsContainerYearMonthElm.appendChild(this.nextYearMonthElm);

        this.calendarEngine.getWeekDays().forEach((weekday) => {
            const weekDayElm = document.createElement('h3');
            weekDayElm.innerText = weekday;
            this.containerCalendarDays.appendChild(weekDayElm);
        });
        this.yearMonthElm.innerText = `${this.calendarEngine.getCurrentMonthName().expanded} ${this.calendarEngine.getCurrentYear()}`;

        this.nextYearMonthElm.addEventListener('click', () => {
            this.monthController(1, 'add');
        });
        this.prevYearMonthElm.addEventListener('click', () => {
            this.monthController(1, 'remove');
        });
    }

    loadElementStyles() {
        this.containerElm.classList.add('Calendar');
        if (this.options.static) this.show();

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
    }

    loadEvents() {
        const resetDaySelection = () => {
            if (!this.calendarEngine.isRangeDefined()) this.resetRange();
        };

        this.containerCalendarDatesElm.addEventListener('mouseleave', resetDaySelection);
        this.containerElm.addEventListener('mouseleave', resetDaySelection);
    }

    loadComponent() {
        this.createElements();
        this.createElementStructure();
        this.loadElementStyles();
        this.insertDatesInScreen();
        this.loadEvents();
    }

    monthController(monthQtd = 1, option = 'add') {
        ({
            'add': () => this.calendarEngine.addMonth(monthQtd),
            'remove': () => this.calendarEngine.removeMonth(monthQtd),
        })[option]();

        const monthName = this.calendarEngine.getCurrentMonthName().expanded;
        const year = this.calendarEngine.getCurrentYear()

        this.yearMonthElm.innerText = `${monthName} ${year}`;
        this.insertDatesInScreen();
    }

    insertDatesInScreen() {
        this.containerCalendarDatesElm.innerHTML = '';
        const dateClickEvent = (event) => {
            const month = parseInt(event.target.getAttribute('month'), 10);
            const year = parseInt(event.target.getAttribute('year'), 10);
            const date = parseInt(event.target.innerText, 10);

            if (this.calendarEngine.mustResetSelection()) this.resetSelection();
            const isSelected = this.calendarEngine.toggleDateSelection(year, month, date);
            if (isSelected) event.target.classList.add('--selected');
            else event.target.classList.remove('--selected');

            if (this.calendarEngine.mustClose()) setTimeout(() => this.hide(), 300);
        };

        const dateMouseHoverEvent = (event) => {
            const month = parseInt(event.target.getAttribute('month'), 10);
            const year = parseInt(event.target.getAttribute('year'), 10);
            const date = parseInt(event.target.innerText, 10);

            if (!this.calendarEngine.isSubSelectingRangeMode()) return;

            this.selectRange(year, month, date);
        };

        this.calendarEngine.getArrayDate().forEach((dateObj, index) => {
            const dateElm = document.createElement('div');
            dateElm.innerText = dateObj.date;
            dateElm.classList.add('calendarDate');
            dateElm.addEventListener('click', dateClickEvent);
            dateElm.addEventListener('mouseenter', dateMouseHoverEvent);
            dateElm.setAttribute('index', index);
            dateElm.setAttribute('date', dateObj.date);
            dateElm.setAttribute('month', dateObj.month);
            dateElm.setAttribute('year', dateObj.year);

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

    selectRange(limitYear, limitMonth, limitDate) {
        Array.from(
            this.containerCalendarDatesElm.children
        ).forEach((dateElm) => {
            const toCompareMonth = parseInt(dateElm.getAttribute('month'), 10);
            const toCompareYear = parseInt(dateElm.getAttribute('year'), 10);
            const toCompareDate = parseInt(dateElm.innerText, 10);

            const toCompare = { date: toCompareDate, month: toCompareMonth, year: toCompareYear };
            const comparisonLimit = { date: limitDate, month: limitMonth, year: limitYear };

            if (this.calendarEngine.isDateSubSelectingRangeMode(toCompare, comparisonLimit))
                dateElm.classList.add('--sub-selected');
            else
                dateElm.classList.remove('--sub-selected');
        });
    };
    
    resetRange() {
        console.log('Executando reset');
        if (this.calendarEngine.isRangeDefined()) return;
        Array.from(
            this.containerCalendarDatesElm.children
        ).forEach((dateElm) => {
            dateElm.classList.remove('--sub-selected');
        });
    }

    resetSelection() {
        console.log('Iniciando resetar seleção');
        Array.from(
            this.containerCalendarDatesElm.children
        ).forEach((dateElm) => {
            if (dateElm.classList.contains('--selected'))
                dateElm.classList.remove('--selected');
        });
    }

    show() {
        console.log('show element');
        this.containerElm.removeAttribute('close');
        this.containerElm.setAttribute('open', '');
    }

    hide() {
        console.log('hide element');
        this.containerElm.removeAttribute('open');
        this.containerElm.setAttribute('close', '');
        this.containerElm.addEventListener('animationend', () => {
            this.containerElm.removeAttribute('close');
            console.log('animação acabou');
        }, { once: true});
        this.insertDatesInScreen();
    }

    toggle() {
        console.log('toggle element', this.containerElm.hasAttribute('open'));
        if (this.containerElm.hasAttribute('open')) this.hide();
        else this.show();
    }
}
