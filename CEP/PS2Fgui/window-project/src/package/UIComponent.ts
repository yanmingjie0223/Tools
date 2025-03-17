import { XmlItemType } from "../const/TypeConst";
import Xml from "../xml/Xml";
import XmlBuilder from "../xml/XmlBuilder";
import XmlItem, { XmlAttribute } from "../xml/XmlItem";

export default class UIComponent {

    private _displayItem: XmlItem;
    private _comItem: XmlItem;
    private _xml: Xml;
    private _displayNum: number;

    public constructor() {
        this._displayItem = null;
        this._comItem = null;
        this._xml = XmlBuilder.createXML();
        this._displayNum = 0;
        this.init();
    }

    public get displayNum(): number {
        return this._displayNum;
    }

    public addAtts(pro: XmlAttribute): void {
        this._comItem.addAtts(pro);
    }

    public setSize(width: number, height: number): void {
        const size = `${width},${height}`;
        this._comItem.addAtt('size', size);
    }

    public addDisplayItem(item: XmlItem): void {
        this._displayItem.addChild(item);
        ++this._displayNum;
    }

    public getString(): string {
        return this._xml.getString();
    }

    private init(): void {
        this._comItem = XmlBuilder.createXMLItem(XmlItemType.component);
        this._displayItem = XmlBuilder.createXMLItem(XmlItemType.displayList);
        this._comItem.addChild(this._displayItem);
        this._xml.addItem(this._comItem);
    }

}