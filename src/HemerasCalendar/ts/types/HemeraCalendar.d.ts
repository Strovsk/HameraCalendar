declare type pixel = number;

declare type CalendarPositionPresetX = {
    start: number;
    end: number;
    center: number;
};

declare type MonthContollerOptions = { add: () => void; remove: () => void};

declare type YearContollerOptions = { add: () => void; remove: () => void};

declare type HTMLEvent = {
    target: HTMLElement;
}
