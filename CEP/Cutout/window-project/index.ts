import Main from "./src/Main";

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
