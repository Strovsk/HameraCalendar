export default class MonthNode {
    public containerElm: HTMLElement = document.createElement('div');

    constructor(monthText: string) {
        this.containerElm.innerText = monthText;
    }

    public get container() : HTMLElement {
        return this.containerElm;
    }
    
}