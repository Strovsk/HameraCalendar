class HemeraCalendar {
    constructor(options = {}) {
        this.options = {
            language: 'pt-br',
            static: false,
            container: undefined,
            pos: undefined, // undefined | { x: number, y: number }
            selectionType: 'range',
            markCurrenDay: true,
            onSelect: (selections) => {
                console.log('date selected', selections);
            },
            onConfirm: (selections, event) => {
                console.log('confirmation', selections, event);
            },
            onCancel: (selections, event) => {
                console.log('cancel', selections, event);
            },
            ...options,
        };

        this.isDatesView = true;

        this.calendarEngine = new HemeraCalendarEngine(options);

        this.containerElm;
        this.containerYearMonthElm;
        this.buttonsContainerYearMonthElm;
        this.yearMonthElm;
        this.prevYearMonthElm;
        this.nextYearMonthElm;
        this.containerCalendarDays;
        this.containerCalendarDatesElm;

        this.containerCalendarMonthYearElm;

        this.containerCalendarActionButtonsElm;
        this.actionOkButtonElm;
        this.actionCancelButtonElm;

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

        this.containerCalendarMonthYearElm = document.createElement('div');

        this.containerCalendarActionButtonsElm = document.createElement('div');
        this.actionOkButtonElm = document.createElement('button');
        this.actionCancelButtonElm = document.createElement('button');
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

        this.containerCalendarDatesElm.setAttribute('open', '');
        this.containerCalendarDays.setAttribute('open', '');
        // this.containerCalendarMonthYearElm.setAttribute('close', '');

        this.containerElm.appendChild(this.containerYearMonthElm);
        this.containerElm.appendChild(this.containerCalendarDays);
        this.containerElm.appendChild(this.containerCalendarDatesElm);
        this.containerElm.appendChild(this.containerCalendarMonthYearElm);
        this.containerElm.appendChild(this.containerCalendarActionButtonsElm);

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

        this.containerCalendarActionButtonsElm.setAttribute('open', '');
        this.containerCalendarActionButtonsElm.appendChild(this.actionCancelButtonElm);
        this.containerCalendarActionButtonsElm.appendChild(this.actionOkButtonElm);
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

        this.containerCalendarMonthYearElm.classList.add('CalendarMonthSelection');
        this.containerCalendarActionButtonsElm.classList.add('CalendarActionContainer');

        this.actionOkButtonElm.innerText = 'Ok';
        this.actionCancelButtonElm.innerText = 'Cancel';
    }

    loadEvents() {
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
            this.options.onConfirm(this.calendarEngine.selections, event);
            this.hide();
        });

        this.actionCancelButtonElm.addEventListener('click', (event) => {
            this.options.onCancel(this.calendarEngine.selections, event);
            this.hide();
        });
    }

    loadComponent() {
        this.createElements();
        this.createElementStructure();
        this.loadElementStyles();
    
        this.insertDatesInScreen();
        this.insertMonthsInScreen();
        this.loadEvents();
    }

    setYearMonth(text) {
        // REFACTOR subsitute all this.yearmonthElm.innerText for this function
        this.yearMonthElm.innerText = text;
    }

    setMonthYearToCurrent() {
        this.yearMonthElm.innerText = `${this.calendarEngine.getCurrentMonthName().expanded} ${this.calendarEngine.getCurrentYear()}`;
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

    yearController(yearQtd = 1, option = 'add') {
        ({
            'add': () => this.calendarEngine.addYear(yearQtd),
            'remove': () => this.calendarEngine.removeYear(yearQtd),
        })[option]();

        const year = this.calendarEngine.getCurrentYear()

        this.yearMonthElm.innerText = `${year}`;
        this.insertDatesInScreen();
    }

    insertMonthsInScreen() {
        this.calendarEngine.monthsOptions[this.options.language].forEach((monthName, index) => {
            const monthElm = document.createElement('div');
            monthElm.addEventListener('click', () => {
                this.calendarEngine.setMonth(index);
                this.insertDatesInScreen();
                this.toggleDatesArea();
            });
            monthElm.innerText = monthName.short;
            this.containerCalendarMonthYearElm.appendChild(monthElm);
        });
    }

    insertDatesInScreen() {
        this.containerCalendarDatesElm.innerHTML = '';
        const dateClickEvent = (event) => {
            const month = parseInt(event.target.getAttribute('month'), 10);
            const year = parseInt(event.target.getAttribute('year'), 10);
            const date = parseInt(event.target.innerText, 10);

            if (this.calendarEngine.mustResetSelection()) this.resetSelection();
            const isSelected = this.calendarEngine.toggleDateSelection(year, month, date);
            if (isSelected) {
                event.target.classList.add('--selected');
                this.options.onSelect({
                    year, month, date,
                    isToday: event.target.classList.contains('--today'),
                    isAnotherMonth: event.target.classList.contains('--anotherMonth'),
                    dateObj: new Date(year, month, date),
                    target: event.target,
                });
            }
            else {
                event.target.classList.remove('--selected');
                if (this.isMobileDevice()) this.resetRange();
            };

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
        console.log('Executando reset de range');
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

    isMobileDevice() {
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

    hideDatesArea() {
        const onAnimationEnd = (event) => {
            console.log('animação de fechar o calendario acabou');
            event.target.removeAttribute('close');
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

    showDatesArea() {
        this.setMonthYearToCurrent();

        this.isDatesView = true;

        this.containerCalendarDatesElm.removeAttribute('close');
        this.containerCalendarDatesElm.setAttribute('open', '');

        this.containerCalendarDays.removeAttribute('close');
        this.containerCalendarDays.setAttribute('open', '');

        this.containerCalendarActionButtonsElm.setAttribute('open', '');
        this.containerCalendarActionButtonsElm.removeAttribute('close');
    }

    toggleDatesArea() {
        if (this.containerCalendarDatesElm.hasAttribute('open')) {
            this.hideDatesArea();
            console.log('fechando calendário');
        }
        else {
            console.log('abrindo calendário');
            this.hideMonthsArea();
        }
    }

    showMonthsArea() {
        this.setYearMonth(this.calendarEngine.currentMonthYear.year);
        this.containerCalendarMonthYearElm.setAttribute('open', '');
        this.containerCalendarMonthYearElm.removeAttribute('close');
    }

    hideMonthsArea() {
        const onAnimationEnd = (event) => {
            console.log('animação de abrir o calendario acabou');
            event.target.removeAttribute('close');
            this.showDatesArea();
        };

        this.containerCalendarMonthYearElm.setAttribute('close', '');
        this.containerCalendarMonthYearElm.removeAttribute('open', '');
        this.containerCalendarMonthYearElm.addEventListener('animationend', onAnimationEnd, { once: true});
    }
}
