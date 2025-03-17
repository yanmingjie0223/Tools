import { AppConfig } from "../config/AppConfig";
import { KindType, XmlItemType } from "../const/TypeConst";
import Utils from "../utils/Utils";
import XmlBuilder from "../xml/XmlBuilder";
import XmlItem from "../xml/XmlItem";
import UIComponent from "./UIComponent";
import UIPackage from "./UIPackage";

let uiPackage: UIPackage;
let outputDir: string;
let viewComponent: UIComponent;

export interface PSLayerData {
    [name: string]: PSLayer;
}

export interface PSLayer {
    /**图层名字 */
    name: string;
    /**图层类型 */
    kind: KindType;
    /**图层范围 */
    bounds: Array<number>;
    /**图层是否可见 */
    visible: boolean;
    /**如果是组，下面还有图层 */
    layers: PSLayerData;
}

export interface PSPackage {
    /**图层级 */
    layers: PSLayerData;
    /**主图层级 */
    document: PSLayer;
    /**文件目录地址 */
    path: string;
}

export interface Size {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function parseLayerData(data: PSPackage, bagName: string) {
    viewComponent = null;
    const buildId = Utils.genBuildId();
    outputDir = `${data.path}/${AppConfig.pckName}`;
    uiPackage = new UIPackage(outputDir, buildId, bagName);

    const layers = data.layers;
    parseUIComponent(
        AppConfig.viewName,
        layers,
        `${outputDir}/`,
        getBounds(data.document)
    );
    uiPackage.addComponent(`${AppConfig.viewName}.xml`, '/');

    const file = outputDir + '/package.xml';
    const fileContent = uiPackage.getString();
    cep.fs.writeFile(file, fileContent);

    alert('导出package成功！');
}

function parseUIComponent(fileName: string, layerSet: PSLayerData, filePath: string, bounds: Array<number>) {
    const uiCom = new UIComponent();
    let comSize = getSize(bounds);
    uiCom.setSize(comSize.width, comSize.height);
    if (!viewComponent) {
        viewComponent = uiCom;
    }

    let size: Size;
    let layer: PSLayer;
    for (const name in layerSet) {
        if (Object.hasOwnProperty.call(layerSet, name)) {
            layer = layerSet[name];
            const curBounds = getBounds(layer);
            size = getSize(curBounds);
            parseLayer(name, layer);
            if (layer.kind) {
                const item = parseLayer2XmlItem(name, layer, uiCom);
                item.addAtt('xy', `${size.x},${size.y}`);
                item.addAtt('size', `${size.width},${size.height}`);
            }
            else {
                uiPackage.addComponent(`${name}.xml`, AppConfig.comPath);
                const item2 = parseCom2XmlItem(name, viewComponent);
                item2.addAtt('xy', `${size.x},${size.y}`);
                item2.addAtt('size', `${size.width},${size.height}`);

                parseUIComponent(
                    name,
                    layer.layers,
                    `${outputDir}${AppConfig.comPath}`,
                    getBounds(layer)
                );
            }
        }
    }

    Utils.createDir(`${filePath}`);
    const file = `${filePath}${fileName}.xml`;
    const fileContent = uiCom.getString();
    cep.fs.writeFile(file, fileContent);
}

function parseLayer(name: string, layer: PSLayer) {
    if (layer.kind === KindType.IMAGE) {
        uiPackage.addImage(`${name}.png`, AppConfig.resPath);
    }
}

function parseLayer2XmlItem(name: string, layer: PSLayer, uiCom: UIComponent) {
    const kind = layer.kind;
    let item: XmlItem;
    if (kind) {
        switch (kind) {
            case KindType.IMAGE:
                item = XmlBuilder.createXMLItem(XmlItemType.image);
                const imageName = `${name}.png`;
                const att = uiPackage.getAttsByKeyAndValue('name', imageName);
                item.addAtt('id', `n${uiCom.displayNum}_${uiPackage.itemIdBase}`);
                item.addAtt('fileName', `image/${name}.png`);
                item.addAtt('name', `${name}`);
                item.addAtt('src', `${att['id']}`);
                break;
            case KindType.TEXT:
                item = XmlBuilder.createXMLItem(XmlItemType.text);
                item.addAtt('id', `n${uiCom.displayNum}_${uiPackage.itemIdBase}`);
                item.addAtt('name', `${name}`);
                item.addAtt('fontSize', `${24}`);
                item.addAtt('text', name);
                break;
            default:
                alert(`存在未处理的类型kind: ${kind}`);
                break;
        }
    }
    item && uiCom.addDisplayItem(item);
    return item;
}

function parseCom2XmlItem(name: string, uiCom: UIComponent) {
    const item = XmlBuilder.createXMLItem(XmlItemType.component);
    const xml = uiPackage.getComponent(`${name}.xml`);
    item.addAtt('id', `n${uiCom.displayNum}_${uiPackage.itemIdBase}`);
    item.addAtt('name', `${name}`);
    item.addAtt('src', `${xml.getAtt('id')}`);
    item && uiCom.addDisplayItem(item);
    return item;
}

function getBounds(layer: PSLayer): Array<number> {
    if (!layer.kind) {
        let rtBounds: Array<number>;
        const layers = layer.layers;
        for (const name in layers) {
            if (Object.hasOwnProperty.call(layers, name)) {
                const curBounds = layers[name].bounds;
                if (!rtBounds) {
                    rtBounds = curBounds;
                }
                else {
                    rtBounds[0] = Math.min(rtBounds[0], curBounds[0]);
                    rtBounds[1] = Math.min(rtBounds[1], curBounds[1]);
                    rtBounds[2] = Math.max(rtBounds[2], curBounds[2]);
                    rtBounds[3] = Math.max(rtBounds[3], curBounds[3]);
                }
            }
        }
        return rtBounds;
    }
    else {
        return layer.bounds;
    }
}

function getSize(bounds: Array<number>): Size {
    const width = bounds[2] - bounds[0];
    const height = bounds[3] - bounds[1];
    const x = bounds[0];
    const y = bounds[1];
    const size = {
        x: x,
        y: y,
        width: width,
        height: height
    }
    return size;
}