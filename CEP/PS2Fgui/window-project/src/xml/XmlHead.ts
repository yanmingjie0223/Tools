import { XmlItemType } from "../const/TypeConst";
import XmlItem from "./XmlItem";

export default class XmlHead extends XmlItem {

    constructor() {
        super(XmlItemType.xml, 0);
    }

    public getString(): string {
        let str = `<?xml`;

        const atts = this._attributes;
        for (const key in atts) {
            if (Object.hasOwnProperty.call(atts, key)) {
                str += ` ${key}="${atts[key]}"`;
            }
        }
        str += `?>`;

        return str;
    }
}