declare type MonthDays = 29 | 28 | 30 | 31;
declare type MonthNameObject = { short: string; expanded: string };

declare type Year = number;
declare type MonthDate = number;
declare type Weekday = string;
declare type MonthName = string;
declare type Month = number;

declare type DateMinimalObj = {
  date: MonthDate;
  month: Month | MonthName;
  year: Year;
};
