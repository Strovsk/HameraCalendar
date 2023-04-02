const calendar = new HemeraCalendar({
    // pos: { x: 500, y: 50 },
    container: '#openDateSelector',
    static: false,
    closeAfterSelect: true,
    selectionType: '1',
});
console.log(calendar.containerElm);
document.body.appendChild(calendar.containerElm);

document.getElementById('openDateSelector').addEventListener('click', () => {
    calendar.toggle();
});
// calendar.selectRange(10, 15);
