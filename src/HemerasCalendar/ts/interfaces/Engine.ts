import { monthsOptions } from '@/helpers/languages';

export default interface IEngine {
  selections: AppSelectedDateObject[];

  get appOptions(): AppOptions;
  set month(monthIndex: Month);
  set year(year: Year);

  getWeekDays(): string[];
  getMonths<T extends keyof typeof monthsOptions>(): (typeof monthsOptions)[T];
  getCurrentYear(): Year;
  resetSelections(): void;
  getArrayDate(): DateInfo[];
  getCurrentMonthName(): MonthNameObject;

  mustClose(): boolean;
  canSelectDate(): boolean;
  isRangeDefined(): boolean;
  hasSubSelection(): boolean;
  mustResetSelection(): boolean;
  isSubSelectingRangeMode(): boolean;
  selectDate(year: Year, month: Month, date: MonthDate): boolean;
  toggleDateSelection(year: Year, month: Month, date: MonthDate): boolean;
  isDateSubSelectingRangeMode(
    toCompareDate: DateMinimalObj,
    limitDate: DateMinimalObj
  ): boolean;
  hasSelectionsInCurrentMonth(): boolean;

  addYear(numberOfYears: number): void;
  addMonth(numberOfMonths: number): void;
  removeYear(numberOfYears: number): void;
  removeMonth(numberOfMonths: number): void;
}
