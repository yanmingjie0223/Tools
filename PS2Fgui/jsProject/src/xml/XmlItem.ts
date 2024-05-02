import { XmlItemType } from "../const/TypeConst";

export interface XmlAttribute {
    [attName: string]: string
}

export default class XmlItem {

    protected _attributes: XmlAttribute;
    private _parent: XmlItem;
    private _childs: Array<XmlItem>;
    private _layerIndex: number;
    private _title: XmlItemType;

    constructor(title: XmlItemType, layerIndex: number) {
        this._parent = null;
        this._title = title;
        this._childs = [];
        this._attributes = {};
        this._layerIndex = layerIndex;
    }

    /**
     * @param {XmlItem} parent
     */
    public set parent(parent: XmlItem) {
        this._parent = parent;
    }

    public get parent() {
        return this._parent;
    }

    public getChilds(): Array<XmlItem> {
        return this._childs;
    }

    public setLayerIndex(index: number): void {
        this._layerIndex = index;
    }

    public addChild(xmlItem: XmlItem): void {
        xmlItem.setLayerIndex(this._layerIndex + 1);
        if (xmlItem.parent) {
            xmlItem.parent.removeChild(xmlItem);
        }
        xmlItem.parent = this;
        this._childs.push(xmlItem);
    }

    public removeChild(xmlItem: XmlItem): void {
        for (let i = 0, len = this._childs.length; i < len; i++) {
            if (xmlItem === this._childs[i]) {
                this._childs.splice(i, 1);
                break;
            }
        }
    }

    public addAtt(attName: string, value: string): void {
        this._attributes[attName] = value;
    }

    public addAtts(param: XmlAttribute): void {
        for (const key in param) {
            if (Object.hasOwnProperty.call(param, key)) {
                this._attributes[key] = param[key];
            }
        }
    }

    public getAtts(): XmlAttribute {
        return this._attributes;
    }

    public getAtt(attName: string): string {
        if (this._attributes && this._attributes[attName]) {
            return this._attributes[attName];
        }
        return null;
    }

    public removeAtt(attName: string): void {
        if (this._attributes[attName]) {
            delete this._attributes[attName];
        }
    }

    public getString(): string {
        const space = this.getSpace();
        let str = `${space}<${this._title}`;

        const atts = this._attributes;
        for (const key in atts) {
            if (Object.hasOwnProperty.call(atts, key)) {
                str += ` ${key}="${atts[key]}"`;
            }
        }

        if (this._childs.length > 0) {
            str += `>`;
            for (let i = 0; i < this._childs.length; i++) {
                str += '\n';
                str += this._childs[i].getString();
            }
            str += `\n${space}</${this._title}>`;
        }
        else {
            str += `/>`;
        }
        return str;
    }

    public getSpace(): string {
        let str = '';
        for (let i = 0; i < this._layerIndex; i++) {
            str += '  ';
        }
        return str;
    }
}