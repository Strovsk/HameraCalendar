declare type AppPosition = {
    x: string | number;
    y: string | number;
    gapTop: number;
    gapLeft: number;
};

declare type AppSelectedDateObject = {
    year: number;
    month: number;
    day: number;
};

declare type AppOptions = {
    language: Languages;
    stayOnTop: boolean;
    container: string | undefined;
    pos: AppPosition | undefined;
    selectionType: string;
    markCurrentDay: boolean;
    closeAfterSelect: boolean;
    init: boolean;
    onSelect?: (selections: AppSelectedDateObject[]) => any;
    onConfirm?: (selections: AppSelectedDateObject[], event: MouseEventInit) => any;
    onCancel?: (selections: AppSelectedDateObject[], event: MouseEventInit) => any;
};
