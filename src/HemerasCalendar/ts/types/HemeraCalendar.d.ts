declare type pixel = number;

declare type CalendarPositionPresetX = {
    start: number;
    end: number;
    center: number;
};

declare type Components = {
    'days': CalendarDays,
    'dates': CalendarDates,
    'header': CalendarHeader,
    'months': CalendarMonths,
    'actionBar': CalendarActionBar,
    'masterContainer': CalendarMasterContainer,
}

declare type MonthContollerOptions = { add: () => void; remove: () => void};

declare type YearContollerOptions = { add: () => void; remove: () => void};

declare type HTMLEvent = {
    target: HTMLElement;
}
