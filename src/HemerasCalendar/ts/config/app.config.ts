import { Languages, DateSelectionOption } from "@/types/enum";

const options: AppOptions = {
    language: Languages.BR,
    showActionButtons: true,
    stayOnTop: false,
    container: undefined,
    pos: { x: 'center', gapTop: 0, gapLeft: 0, y: 0 },
    selectionType: DateSelectionOption.range,
    markCurrentDay: true,
    closeAfterSelect: true,
    init: true,
}

export default options;
