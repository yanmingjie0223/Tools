import { XmlItemType } from "../const/TypeConst";
import Xml from "../xml/Xml";
import XmlBuilder from "../xml/XmlBuilder";
import XmlItem, { XmlAttribute } from "../xml/XmlItem";

export default class UIPackage {
    /**id */
    private _id: string;
    /**文件id基础，后面累加计数 */
    private _itemIdBase: string;
    /**累计计算 */
    private _nextItemIndex: number;
    /**包名 */
    private _bagName: string;
    /**包xml对象 */
    private _xml: Xml;
    /**resources项 */
    private _resourcesItem: XmlItem;

    constructor(basePath: string, buildId: string, bagName: string) {
        this._id = buildId.substr(0, 8);
        this._itemIdBase = buildId.substr(8);
        this._nextItemIndex = 0;
        this._bagName = bagName;
        this._xml = XmlBuilder.createXML();
        this.init();
    }

    public get itemIdBase(): string {
        return this._itemIdBase;
    }

    public getNextItemId(): string {
        return this._itemIdBase + (this._nextItemIndex++).toString(36);
    }

    public getString(): string {
        return this._xml.getString();
    }

    public getAttsByKeyAndValue(key: string, value: string): XmlAttribute {
        const items = this._resourcesItem.getChilds();
        for (let i = 0, len = items.length; i < len; i++) {
            const atts = items[i].getAtts();
            if (atts[key] === value) {
                return atts;
            }
        }
        return null;
    }

    public addImage(name: string, path: string): void {
        const item = XmlBuilder.createXMLItem(XmlItemType.image, 2);
        item.addAtt('id', this.getNextItemId());
        item.addAtt('name', name);
        item.addAtt('path', path);
        this._resourcesItem.addChild(item);
    }

    public addComponent(name: string, path: string): void {
        const item = XmlBuilder.createXMLItem(XmlItemType.component, 2);
        item.addAtt('id', this.getNextItemId());
        item.addAtt('name', name);
        item.addAtt('path', path);
        item.addAtt('exported', 'true');
        this._resourcesItem.addChild(item);
    }

    public getComponent(name: string): XmlItem {
        const items = this._resourcesItem.getChilds();
        for (let i = 0, len = items.length; i < len; i++) {
            const attName = items[i].getAtt('name');
            if (attName === name) {
                return items[i];
            }
        }
        return null;
    }

    private init(): void {
        const desParam = {
            id: this._id,
            jpegQuality: '80',
            compressPNG: 'true'
        } as XmlAttribute;
        const desItem = XmlBuilder.createXMLItem(XmlItemType.packageDescription);
        this._resourcesItem = XmlBuilder.createXMLItem(XmlItemType.resources);
        const publishItem = XmlBuilder.createXMLItem(XmlItemType.publish);

        desItem.addAtts(desParam);
        desItem.addChild(this._resourcesItem);
        desItem.addChild(publishItem);
        publishItem.addAtts({ name: this._bagName});

        this._xml.addItem(desItem);
    }

}