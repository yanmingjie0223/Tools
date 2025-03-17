import Utils from "./Utils";

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
    }

    private addListerCEPEvent(): void {
        // todo: 添加cep插件中传递过来的信息
    }

}
