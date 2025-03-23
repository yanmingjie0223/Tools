import Utils from "./utils";

export default class Main {

    private _csInterface: CSInterface;

    public constructor() {
        this.initialize();
    }

    public getCSInterface(): CSInterface {
        return this._csInterface;
    }

    private initialize(): void {
        const csInterface = new CSInterface();
        this._csInterface = csInterface;
        this.addListerCEPEvent();
        Utils.loadJSX(csInterface, 'lib/json2.jsx');
        Utils.loadJSX(csInterface, 'utils.jsx');
        Utils.loadJSX(csInterface, 'main.jsx');
        Utils.loadJSX(csInterface, 'cutout.jsx');
    }

    private addListerCEPEvent(): void {
    }

}
