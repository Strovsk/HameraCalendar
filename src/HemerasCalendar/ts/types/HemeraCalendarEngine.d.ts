declare type MonthInfo = {
  numberOfDays: number;
  startWeekDay: WeekDay;
  monthNumber: Month;
  year: Year;
  monthName: string;
  weekdayName: string;
  nextMonthNumber: Month;
  lastMonthNumber: Month;
  lastMonthYear: Month;
  nextMonthYear: Month;
  nextMonthNumberOfDays: MonthDays;
  lastMonthNumberOfDays: MonthDays;
};

declare type MonthNameObject = {
  short: string;
  expanded: string;
};

declare type DateInfo = {
  year: Year;
  month: Month;
  date: MonthDate;
  isToday: boolean;
  isAnotherMonth: boolean;
  isLastMonth: boolean;
  isNextMonth: boolean;
  isSelected: boolean;
  isSubSelected: boolean;
};

declare type HemeraEngineDateSelectionOptions = {
  [key in DateSelectionOption]: () => boolean;
};
