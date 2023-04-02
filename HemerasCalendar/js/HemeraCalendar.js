class Calendar {
    constructor(options = {}) {
        this.options = {
            language: 'pt-br',
            static: false,
            container: undefined,
            isRange: true,
            pos: { x: 0, y: 0 },
            selectionType: 'range',
            markCurrenDay: true,
            ...options,
        };

        this.calendarEngine = new HemeraCalendarEngine(options);

        this.dateRangeSelection = [];

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

    createElementStructure() {
        this.containerElm.style.top = this.options.pos.y + 'px';
        this.containerElm.style.left = this.options.pos.x + 'px';

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
            console.log(this.dateRangeSelection);
            if (this.dateRangeSelection.length < 2)
                this.resetRange();
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

    selectDate(index, month, year, element) {
        if (this.dateRangeSelection.length === 0) {
            this.dateRangeSelection.push({ index, month, year });
            element.classList.add('--selected');
            return;
        }

        const isSelected = this.dateRangeSelection.filter((dateSelection) => (
            dateSelection.index === index && dateSelection.month === month && dateSelection.year === year
        ));

        if (isSelected.length > 0) {
            element.classList.remove('--selected');
            const toRemoveIndex = this.dateRangeSelection.indexOf(isSelected[0]);
            this.dateRangeSelection.splice(toRemoveIndex, 1);
            this.resetRange();
            return;
        }

        if (this.dateRangeSelection.length === 1 && this.options.isRange) {
            this.dateRangeSelection.push({ index, month, year });
            element.classList.add('--selected');
            const [firstIndex, secondIndex] = this.dateRangeSelection.flatMap(e => e.index);
            this.selectRange(firstIndex, secondIndex);
            return;
        }
    }

    insertDatesInScreen() {
        this.containerCalendarDatesElm.innerHTML = '';
        const dateClickEvent = (event) => {
            const month = parseInt(event.target.getAttribute('month'), 10);
            const year = parseInt(event.target.getAttribute('year'), 10);
            const date = parseInt(event.target.innerText, 10);

            const isSelected = this.calendarEngine.toggleDateSelection(year, month, date);
            if (isSelected) event.target.classList.add('--selected');
            else event.target.classList.remove('--selected');
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
}
