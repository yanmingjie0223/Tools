import Utils from "./utils";

export default class Main {

    private _csInterface: CSInterface;

    public constructor() {
        this.initialize();
        this.initializeView()
    }

    public getCSInterface(): CSInterface {
        return this._csInterface;
    }

    private initialize(): void {
        const csInterface = new CSInterface();
        this._csInterface = csInterface;
        Utils.loadJSX(csInterface, 'lib/json2.jsx');
        Utils.loadJSX(csInterface, 'utils.jsx');
        Utils.loadJSX(csInterface, 'main.jsx');
        Utils.loadJSX(csInterface, 'cutout.jsx');
    }

    private initializeView(): void {
        const config = Utils.getJson<ExportOptions>(this._csInterface, "config");
        const quality = window.document.getElementById("quality") as HTMLInputElement;
        const allPsd = window.document.getElementById('all-psd') as HTMLInputElement;
        allPsd.checked = config.isAllPsd;
        quality.value = `${config.quality}`;
    }

}
