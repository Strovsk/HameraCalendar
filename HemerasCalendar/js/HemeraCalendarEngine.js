class HemeraCalendarEngine {
    constructor(options) {
        this.options = {
            language: 'pt-br',
            static: false,
            container: undefined,
            selectionType: 'range',
            markCurrentDay: true,
            pos: { x: 0, y: 0 },
            closeAfterSelect: true,
            ...options,
        };

        this.today = new Date();
        this.currentMonthYear = {
            month: this.today.getMonth(),
            year: this.today.getFullYear(),
        };
        this.selections = [];

        this.shortWeekDaysOptions = {
            'pt-br': ['D', 'S', 'T', 'Q', 'Qt', 'S', 'Sb'],
            en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        };
        this.monthsOptions = {
            'pt-br': [
                { short: 'Jan', expanded: 'Janeiro' },
                { short: 'Fev', expanded: 'Fevereiro' },
                { short: 'Mar', expanded: 'Março' },
                { short: 'Abr', expanded: 'Abril' },
                { short: 'Mai', expanded: 'Maio' },
                { short: 'Jun', expanded: 'Junho' },
                { short: 'Jul', expanded: 'Julho' },
                { short: 'Ago', expanded: 'Agosto' },
                { short: 'Set', expanded: 'Setembro' },
                { short: 'Out', expanded: 'Outubro' },
                { short: 'Nov', expanded: 'Novembro' },
                { short: 'Dez', expanded: 'Dezembro' },
            ],
            en: [
                { short: 'Jan', expanded: 'January' },
                { short: 'Feb', expanded: 'February' },
                { short: 'Mar', expanded: 'March' },
                { short: 'Apr', expanded: 'April' },
                { short: 'May', expanded: 'May' },
                { short: 'Jun', expanded: 'June' },
                { short: 'Jul', expanded: 'July' },
                { short: 'Aug', expanded: 'August' },
                { short: 'Sep', expanded: 'September' },
                { short: 'Oct', expanded: 'October' },
                { short: 'Nov', expanded: 'November' },
                { short: 'Dec', expanded: 'December' },
            ],
        };
    }

    setMonth(month) {
        if (month <= 0 || month >= 12) return;
        this.currentMonthYear.month = month;
    }

    addMonth(numberOfMonths = 1) {
        const { month, year } = this.currentMonthYear;
        const bufferDate = new Date(year, month + numberOfMonths, 1);
        this.currentMonthYear.month = bufferDate.getMonth();
        this.currentMonthYear.year = bufferDate.getFullYear();
    }

    removeMonth(numberOfMonths = 1) {
        const { month, year } = this.currentMonthYear;
        const bufferDate = new Date(year, month - numberOfMonths, 1);
        this.currentMonthYear.month = bufferDate.getMonth();
        this.currentMonthYear.year = bufferDate.getFullYear();
    }

    setYear(year) {
        if (typeof year !== 'number') return;
        this.currentMonthYear.year = year;
    }

    addYear(numberOfYears = 1) {
        const { month, year } = this.currentMonthYear;
        const bufferDate = new Date(year + numberOfYears, month, 1);
        this.currentMonthYear.month = bufferDate.getMonth();
        this.currentMonthYear.year = bufferDate.getFullYear();
    }

    removeYear(numberOfYears = 1) {
        const { month, year } = this.currentMonthYear;
        const bufferDate = new Date(year - numberOfYears, month, 1);
        this.currentMonthYear.month = bufferDate.getMonth();
        this.currentMonthYear.year = bufferDate.getFullYear();
    }

    _getMonthInfo(monthNumber, year) {
        const numberOfDays = new Date(year, monthNumber + 1, 0).getDate();
        const monthInfo = new Date(year, monthNumber, 1);
        const startWeekDay = monthInfo.getDay();
        const monthName = this.monthsOptions[this.options.language][monthNumber];
        const weekdayName = this.shortWeekDaysOptions[this.options.language][startWeekDay];

        const lastMonth = new Date(year, monthNumber - 1, 1);
        const nextMonth = new Date(year, monthNumber + 1, 1);
        const lastMonthNumberOfDays = new Date(year, monthNumber, 0).getDate();
        const nextMonthNumberOfDays = new Date(year, monthNumber + 2, 0).getDate();
        const lastMonthNumber = lastMonth.getMonth();
        const nextMonthNumber = nextMonth.getMonth();
        const lastMonthYear = lastMonth.getFullYear();
        const nextMonthYear = nextMonth.getFullYear();
        return {
            numberOfDays, startWeekDay, monthNumber, year, monthName, weekdayName,
            nextMonthNumber, lastMonthNumber, lastMonthYear, nextMonthYear, nextMonthNumberOfDays, lastMonthNumberOfDays,
        };
    }

    isToday(year, month, date) {
        return this.today.getFullYear() === year && this.today.getMonth() === month && this.today.getDate() === date;
    }

    getArrayDate() {
        // A date is a object with the informations:
        // { date, month, year, day, index, isAnotherMonth, isNextMonth, isLastMonth, isCurrentDate, isSelected, isSubSelected }
        const monthInfo = this._getMonthInfo(this.currentMonthYear.month, this.currentMonthYear.year);

        const arrayDates = [];
        const daysInWeek = 7;
        const thursdayIndex = 5;
        let numberOfWeekRows = 5;
        if (monthInfo.startWeekDay >= thursdayIndex) numberOfWeekRows += 1

        const numberOfNodesInArray = daysInWeek * numberOfWeekRows;
        
        let nextMonthDate = 0;
        for (let i = 1; i <= numberOfNodesInArray; i+= 1) {
            if (i <= monthInfo.startWeekDay) {
                const lastMonthDate = monthInfo.lastMonthNumberOfDays - monthInfo.startWeekDay + i
                arrayDates.push({
                    year: monthInfo.lastMonthYear,
                    month: monthInfo.lastMonthNumber,
                    date: lastMonthDate,
                    isToday: false,
                    isAnotherMonth: true,
                    isLastMonth: true,
                    isNextMonth: false,
                    isSubSelected: this.isSubSelectedDate(monthInfo.lastMonthYear, monthInfo.lastMonthNumber, lastMonthDate),
                    isSelected: this.isDateInSelection(monthInfo.lastMonthYear, monthInfo.lastMonthNumber, lastMonthDate),
                });
            } else if (i > monthInfo.startWeekDay + monthInfo.numberOfDays) {
                nextMonthDate +=1
                arrayDates.push({
                    year: monthInfo.nextMonthYear,
                    month: monthInfo.nextMonthNumber,
                    date: nextMonthDate,
                    isToday: false,
                    isAnotherMonth: true,
                    isLastMonth: false,
                    isNextMonth: true,
                    isSelected: this.isDateInSelection(monthInfo.nextMonthYear, monthInfo.nextMonthNumber, nextMonthDate),
                    isSubSelected: this.isSubSelectedDate(monthInfo.nextMonthYear, monthInfo.nextMonthNumber, nextMonthDate),
                });
            } else {
                const currentDate = i - monthInfo.startWeekDay;
                const dateInfo = {
                    year: monthInfo.year,
                    month: monthInfo.monthNumber,
                    date: currentDate,
                    isToday: this.isToday(monthInfo.year, monthInfo.monthNumber, currentDate) && this.options.markCurrentDay,
                    isAnotherMonth: false,
                    isLastMonth: false,
                    isNextMonth: false,
                    isSelected: this.isDateInSelection(monthInfo.year, monthInfo.monthNumber, currentDate),
                    isSubSelected: this.isSubSelectedDate(monthInfo.year, monthInfo.monthNumber, currentDate),
                };
                arrayDates.push(dateInfo);
            }
        }

        console.log('Array final', arrayDates);
        return arrayDates;
    }

    selectDate(year, month, date) {
        try {
            new Date(year, month, date);
        } catch (error) { return false; }

        if (this.isDateInSelection(year, month, date)) return false;

        return ({
            'n': () => {
                this.selections.push({ year, month, date })
                return true;
            },
            'range': () => {
                if (this.selections.length >= 2) return false;
                this.selections.push({ year, month, date });
                return true;
            },
            '1': () => {
                if (this.selections.length !== 0) return false;
                this.selections.push({ year, month, date });
                return true;
            }
        })[this.options.selectionType]();
    }

    toggleDateSelection(year, month, date) {
        const findDate = this.selections.find(
            (selectedDate) => selectedDate.year === year && selectedDate.month === month && selectedDate.date === date
        );

        if (!findDate) return this.selectDate(year, month, date);

        const indexToRemove = this.selections.indexOf(findDate);
        this.selections.splice(indexToRemove, 1);
        return false;
    }

    canSelectDate() {
        return (
            this.options.selectionType === 'n' ||
            this.selections === 0 ||
            (this.selections === 1 && this.options.selectionType === 'range')
        );
    }

    isDateInSelection(year, month, date) {
        return this.selections.some(
            (selectedDate) => selectedDate.year === year && selectedDate.month === month && selectedDate.date === date
        );
    }

    isSubSelectedDate(year, month, date) {
        if (!this.isRangeDefined()) return false;
        this.selections.sort((dateA, dateB) => (
            new Date(dateA.year, dateA.month, dateA.date) - new Date(dateB.year, dateB.month, dateB.date)
        ));
        const toCompareDate = new Date(year, month, date);
        const startDate = new Date(this.selections[0].year, this.selections[0].month, this.selections[0].date);
        const endDate = new Date(this.selections[1].year, this.selections[1].month, this.selections[1].date);
        return toCompareDate > startDate && toCompareDate < endDate;
    }

    isRangeDefined() {
        // There's two dates in selections array and selection type is 'range'
        return this.options.selectionType === 'range' && this.selections.length === 2;
    }

    hasSubSelection() {
        return this.options.selectionType === 'range' && this.selections.length === 2;
    }

    getCurrentMonthName(monthNumber = undefined) {
        if (!monthNumber) return this.monthsOptions[this.options.language][this.currentMonthYear.month];
        return this.monthsOptions[this.options.language][monthNumber];
    }

    getCurrentYear() {
        return this.currentMonthYear.year;
    }

    getWeekDays() {
        return this.shortWeekDaysOptions[this.options.language];
    }

    isSubSelectingRangeMode() {
        return this.options.selectionType === 'range' && this.selections.length === 1;
    }

    isDateSubSelectingRangeMode(toCompareDate, limitDate) {
        if (!this.isSubSelectingRangeMode()) return false;
        const selectedDate = new Date(this.selections[0].year, this.selections[0].month, this.selections[0].date);
        const toCompareDateObj = new Date(toCompareDate.year, toCompareDate.month, toCompareDate.date);
        const limitDateObj = new Date(limitDate.year, limitDate.month, limitDate.date);
        const sortedPeriod = [limitDateObj, selectedDate].sort(
            (dateA, dateB) => dateA - dateB
        );
        return toCompareDateObj > sortedPeriod[0] && toCompareDateObj < sortedPeriod[1];
    }

    mustClose() {
        return (
            (this.options.selectionType === '1' && this.selections.length === 1) ||
            (this.options.selectionType === 'range' && this.selections.length === 2)
        ) && this.options.closeAfterSelect;
    }
}
