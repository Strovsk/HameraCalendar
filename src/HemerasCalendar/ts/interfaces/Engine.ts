export default interface IEngine {
    getWeekDays(): string[];
    getCurrentYear(): Year;
    resetSelections(): void;
    getArrayDate(): DateInfo[]
    getCurrentMonthName(): MonthNameObject;
    
    mustClose(): boolean;
    canSelectDate(): boolean;
    isRangeDefined(): boolean;
    hasSubSelection(): boolean;
    mustResetSelection(): boolean;
    isSubSelectingRangeMode(): boolean;
    selectDate(year: Year, month: Month, date: MonthDate): boolean;
    toggleDateSelection(year: Year, month: Month, date: MonthDate): boolean;
    isDateSubSelectingRangeMode(toCompareDate: AppSelectedDateObject, limitDate: AppSelectedDateObject): boolean;

    addYear(numberOfYears: number): void;
    addMonth(numberOfMonths: number): void;
    removeYear(numberOfYears: number): void;
    removeMonth(numberOfMonths: number): void;
}