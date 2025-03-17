import { XmlItemType } from "../const/TypeConst";
import Xml from "./Xml";
import XmlItem from "./XmlItem";

export default class XmlBuilder {

    public static createXML() {
        const xml = new Xml();
        xml.setHead({version: '1.0', encoding: 'utf-8'});
        return xml;
    }

    static createXMLItem(title: XmlItemType, index: number = 0) {
        const item = new XmlItem(title, index);
        return item;
    }

}