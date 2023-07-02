export default class ActionButton {
    private containerElm: HTMLElement = document.createElement('button');

    constructor(text: string = '') {
        this.containerElm.innerText = text;
    }

    public get container(): HTMLElement {
        return this.containerElm;
    }
}
