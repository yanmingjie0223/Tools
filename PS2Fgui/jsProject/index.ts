import { AppConfig } from "./src/config/AppConfig";
import Main from "./src/Main";
import Utils from "./src/utils/Utils";

const windowCEP: any = window || {};
const main = new Main();
const csInterface = main.getCSInterface();

windowCEP.batchExport = function(): void {
    const dialogData = cep.fs.showOpenDialog(false, true, "选择切图导出目录", "D:/");
    const path = dialogData.data[0];
    if (path) {
        csInterface.evalScript(`batchExport('${path}');`);
    }
}

windowCEP.packageExport = function(): void {
    const dialogData = cep.fs.showOpenDialog(false, true, "选择fairygui导出目录", "D:/");
    const path = dialogData.data[0];
    const imagePath = `${path}/${AppConfig.pckName}${AppConfig.resPath}`;
    const imageDirPath = imagePath.substr(0, imagePath.length - 1);
    if (path) {
        Utils.createDir(`${path}/${AppConfig.pckName}`);
        Utils.createDir(imageDirPath);

        const scriptStr = `packageExport('${path}','${imageDirPath}');`;
        csInterface.evalScript(scriptStr);
    }
}

windowCEP.clickTest = function() {
    csInterface.evalScript(`test();`);
}

