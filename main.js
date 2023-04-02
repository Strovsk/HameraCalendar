const calendar = new Calendar({ pos: { x: 500, y: 50 }, isRange: true, selectionType: 'range' });
console.log(calendar.containerElm);
document.body.appendChild(calendar.containerElm);
// calendar.selectRange(10, 15);
