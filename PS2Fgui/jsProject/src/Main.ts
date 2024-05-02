import { AppConfig } from "./config/AppConfig";
import { parseLayerData } from "./package/BuilderPackage";
import Utils from "./utils/Utils";

export default class Main {

    private _csInterface: CSInterface;

    public constructor() {
        this.init();
    }

    public getCSInterface(): CSInterface {
        return this._csInterface;
    }

    private init(): void {
        const csInterface = new CSInterface();
        this._csInterface = csInterface;
        this.addListerCEPEvent();
        Utils.loadJSX(csInterface, 'lib/json2.jsx');
        Utils.loadJSX(csInterface, 'utils.jsx');
        Utils.loadJSX(csInterface, 'batch.jsx');
        Utils.loadJSX(csInterface, 'package.jsx');
        Utils.loadJSX(csInterface, 'test.jsx');
    }

    private addListerCEPEvent(): void {
        this._csInterface.addEventListener("psd_layer_data", this.packageLyaerDeal);
    }

    private packageLyaerDeal(event): void {
        parseLayerData(event.data, AppConfig.pckName);
    }

}