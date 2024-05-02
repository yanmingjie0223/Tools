import XmlHead from "./XmlHead";
import XmlItem, { XmlAttribute } from "./XmlItem";

export default class Xml {

    private _head: XmlHead;
    private _items: Array<XmlItem>;

    constructor() {
        this._head = new XmlHead();
        this._items = [];
    }

    public addItem(item: XmlItem): void {
        this._items.push(item);
    }

    public setHead(pro: XmlAttribute): void {
        for (const attName in pro) {
            if (Object.hasOwnProperty.call(pro, attName)) {
                this._head.addAtt(attName, pro[attName]);
            }
        }
    }

    public removeItem(item: XmlItem): void {
        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i] === item) {
                this._items.splice(i, 1);
                break;
            }
        }
    }

    public getString(): string {
        let str = this._head.getString();
        for (let i = 0; i < this._items.length; i++) {
            str += `\n${this._items[i].getString()}`;
        }
        return str;
    }

    public getItem(index: number): XmlItem {
        if (index >= this._items.length) {
            return null;
        }
        return this._items[index];
    }

    public addChild(item: XmlItem, index: number = 0): void {
        if (index >= this._items.length) {
            return;
        }
        const indexItem = this._items[index];
        if (indexItem) {
            indexItem.addChild(item);
        }
    }
}