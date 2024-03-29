import { shortWeekDaysOptions, monthsOptions } from '@/helpers/languages';
import generateArrayDates from '@/utils/generateArrayDates';
import { Config } from '@/config';
import { Month, DateSelectionOption } from '@/types/enum';
import { IEngine } from '@/interfaces';

export class HemeraCalendarEngine implements IEngine {
  public options: AppOptions = Config.appOptions;
  public today: Date = new Date();
  public currentMonthYear = {
    month: this.today.getMonth() as Month,
    year: this.today.getFullYear(),
  };
  public selections: AppSelectedDateObject[] = [];
  public shortWeekDaysOptions = shortWeekDaysOptions;
  public monthsOptions = monthsOptions;

  constructor(options: AppOptions) {
    this.options = { ...this.options, ...options } as AppOptions;
  }

  get appOptions(): AppOptions {
    return this.options;
  }

  set month(monthIndex: Month) {
    if (monthIndex <= 0 && monthIndex >= 11)
      throw new Error('month must be a number between 0 and 11');
    this.currentMonthYear.month = monthIndex;
  }

  public getMonths<
    T extends keyof typeof monthsOptions,
  >(): (typeof monthsOptions)[T] {
    const language = this.options.language as keyof typeof monthsOptions;
    return this.monthsOptions[language];
  }

  public addMonth(numberOfMonths = 1) {
    // TODO deprecate this method
    const { month, year } = this.currentMonthYear;
    const bufferDate = new Date(year, month + numberOfMonths, 1);
    this.currentMonthYear.month = bufferDate.getMonth();
    this.currentMonthYear.year = bufferDate.getFullYear();
  }

  public removeMonth(numberOfMonths = 1) {
    // TODO deprecate this method
    const { month, year } = this.currentMonthYear;
    const bufferDate = new Date(year, month - numberOfMonths, 1);
    this.currentMonthYear.month = bufferDate.getMonth();
    this.currentMonthYear.year = bufferDate.getFullYear();
  }

  set year(year: Year) {
    if (typeof year !== 'number') return;
    this.currentMonthYear.year = year;
  }

  public addYear(numberOfYears = 1) {
    // TODO deprecate this method
    const { month, year } = this.currentMonthYear;
    const bufferDate = new Date(year + numberOfYears, month, 1);
    this.currentMonthYear.month = bufferDate.getMonth();
    this.currentMonthYear.year = bufferDate.getFullYear();
  }

  public removeYear(numberOfYears = 1) {
    // TODO deprecate this method
    const { month, year } = this.currentMonthYear;
    const bufferDate = new Date(year - numberOfYears, month, 1);
    this.currentMonthYear.month = bufferDate.getMonth();
    this.currentMonthYear.year = bufferDate.getFullYear();
  }

  private getMonthInfo(monthNumber: Month, year: Year): MonthInfo {
    const numberOfDays = new Date(year, monthNumber + 1, 0).getDate();
    const monthInfo = new Date(year, monthNumber, 1);
    const startWeekDay = monthInfo.getDay();
    const language = this.options.language as keyof typeof monthsOptions;
    const monthName = this.monthsOptions[language][monthNumber].expanded;
    const weekdayName = this.shortWeekDaysOptions[language][startWeekDay];

    const lastMonth = new Date(year, monthNumber - 1, 1);
    const nextMonth = new Date(year, monthNumber + 1, 1);
    const lastMonthNumberOfDays = new Date(
      year,
      monthNumber,
      0
    ).getDate() as MonthDays;
    const nextMonthNumberOfDays = new Date(
      year,
      monthNumber + 2,
      0
    ).getDate() as MonthDays;
    const lastMonthNumber = lastMonth.getMonth();
    const nextMonthNumber = nextMonth.getMonth();
    const lastMonthYear = lastMonth.getFullYear();
    const nextMonthYear = nextMonth.getFullYear();

    return {
      numberOfDays,
      startWeekDay,
      monthNumber,
      year,
      monthName,
      weekdayName,
      nextMonthNumber,
      lastMonthNumber,
      lastMonthYear,
      nextMonthYear,
      nextMonthNumberOfDays,
      lastMonthNumberOfDays,
    };
  }

  public mustResetSelection(): boolean {
    return (
      this.options.selectionType === DateSelectionOption.one &&
      this.selections.length > 0
    );
  }

  public resetSelections(): void {
    this.selections = [];
  }

  public getArrayDate(): DateInfo[] {
    const monthInfo = this.getMonthInfo(
      this.currentMonthYear.month,
      this.currentMonthYear.year
    );
    const arrayDates = generateArrayDates(monthInfo);

    return arrayDates.map((dateElm: DateInfo) => {
      dateElm.isSubSelected = this.isSubSelectedDate(
        dateElm.year,
        dateElm.month,
        dateElm.date
      );
      dateElm.isSelected = this.isDateInSelection(
        dateElm.year,
        dateElm.month,
        dateElm.date
      );
      return dateElm;
    });
  }

  public selectDate(year: Year, month: Month, date: MonthDate): boolean {
    try {
      new Date(year, month, date);
    } catch (error) {
      return false;
    }

    if (this.isDateInSelection(year, month, date)) return false;

    const options: HemeraEngineDateSelectionOptions = {
      one: () => {
        if (this.selections.length > 0) this.resetSelections();
        this.selections.push({ year, month, date });
        return true;
      },
      multiple: () => {
        this.selections.push({ year, month, date });
        return true;
      },
      range: () => {
        if (this.selections.length >= 2) return false;
        this.selections.push({ year, month, date });
        return true;
      },
    };

    return options[
      this.options.selectionType as keyof HemeraEngineDateSelectionOptions
    ]();
  }

  public toggleDateSelection(
    year: Year,
    month: Month,
    date: MonthDate
  ): boolean {
    const findDate = this.selections.find(
      (selectedDate) =>
        selectedDate.year === year &&
        selectedDate.month === month &&
        selectedDate.date === date
    );

    if (!findDate) return this.selectDate(year, month, date);

    const indexToRemove = this.selections.indexOf(findDate);
    this.selections.splice(indexToRemove, 1);
    return false;
  }

  public canSelectDate(): boolean {
    return (
      this.options.selectionType === DateSelectionOption.multiple ||
      this.selections.length === 0 ||
      (this.selections.length === 1 &&
        this.options.selectionType === DateSelectionOption.range)
    );
  }

  public isDateInSelection(year: Year, month: Month, date: MonthDate) {
    return this.selections.some(
      (selectedDate) =>
        selectedDate.year === year &&
        selectedDate.month === month &&
        selectedDate.date === date
    );
  }

  public hasSelectionsInCurrentMonth(): boolean {
    return this.selections.some(
      (selectedDate) => selectedDate.month === this.currentMonthYear.month
    );
  }

  public isSubSelectedDate(year: Year, month: Month, date: MonthDate) {
    if (!this.isRangeDefined()) return false;

    const checkDate = (
      dateA: AppSelectedDateObject,
      dateB: AppSelectedDateObject
    ) => {
      const dateAObj = new Date(dateA.year, dateA.month, dateA.date);
      const dateBObj = new Date(dateB.year, dateB.month, dateB.date);
      return dateAObj.getTime() - dateBObj.getTime();
    };

    this.selections.sort(checkDate);

    const toCompareDate = new Date(year, month, date);
    const startDate = new Date(
      this.selections[0].year,
      this.selections[0].month,
      this.selections[0].date
    );
    const endDate = new Date(
      this.selections[1].year,
      this.selections[1].month,
      this.selections[1].date
    );

    return toCompareDate > startDate && toCompareDate < endDate;
  }

  public isRangeDefined(): boolean {
    // There's two dates in selections array and selection type is 'range'
    return (
      this.options.selectionType === DateSelectionOption.range &&
      this.selections.length === 2
    );
  }

  public hasSubSelection(): boolean {
    return (
      this.options.selectionType === DateSelectionOption.range &&
      this.selections.length === 2
    );
  }

  public getCurrentMonthName(): MonthNameObject {
    const language = this.options.language as keyof typeof monthsOptions;
    return this.monthsOptions[language][this.currentMonthYear.month];
  }

  public getCurrentYear(): Year {
    // TODO remove this method
    return this.currentMonthYear.year;
  }

  public getWeekDays(): string[] {
    // TODO transform it in a getter
    const language = this.options.language as keyof typeof monthsOptions;
    return this.shortWeekDaysOptions[language];
  }

  public isSubSelectingRangeMode(): boolean {
    return (
      this.options.selectionType === DateSelectionOption.range &&
      this.selections.length === 1
    );
  }

  public isDateSubSelectingRangeMode(
    toCompareDate: DateMinimalObj,
    limitDate: DateMinimalObj
  ): boolean {
    if (!this.isSubSelectingRangeMode()) return false;

    const selectedDate = new Date(
      this.selections[0].year,
      this.selections[0].month,
      this.selections[0].date
    );
    const toCompareDateObj = new Date(
      toCompareDate.year,
      toCompareDate.month as Month,
      toCompareDate.date
    );
    const limitDateObj = new Date(
      limitDate.year,
      limitDate.month as Month,
      limitDate.date
    );

    const sortedPeriod = [limitDateObj, selectedDate].sort(
      (dateA, dateB) => (dateA as any) - (dateB as any)
    );

    return (
      toCompareDateObj > sortedPeriod[0] && toCompareDateObj < sortedPeriod[1]
    );
  }

  public mustClose(): boolean {
    console.log('after select: ', this.options.closeAfterSelect);

    return (
      ((this.options.selectionType === DateSelectionOption.one &&
        this.selections.length === 1) ||
        (this.options.selectionType === DateSelectionOption.range &&
          this.selections.length === 2)) &&
      this.options.closeAfterSelect
    );
  }
}
