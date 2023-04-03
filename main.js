const calendar = new HemeraCalendar({
    // pos: { x: 500, y: 50 },
    container: '#openDateSelector',
    static: true,
    closeAfterSelect: false,
    selectionType: '1',
    // onSelect: (selections) => {},
    // onConfirmation: (selctions) => {},
});
console.log(calendar.containerElm);
// calendar.hideDatesArea();
document.body.appendChild(calendar.containerElm);

document.getElementById('openDateSelector').addEventListener('click', () => {
    calendar.toggle();
});
// calendar.selectRange(10, 15);

const selections = [
    {
        "year": 2023,
        "month": 2,
        "date": 26,
        "isToday": false,
        "isAnotherMonth": true,
        "isLastMonth": true,
        "isNextMonth": false,
        "isSubSelected": false,
        "isSelected": false,
        "dateObj": new Date(2023, 2, 26)
    },
];
