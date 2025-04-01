import Main from "./src/main";
import Utils from "./src/utils";

const windowCEP: any = window || {};
const main = new Main();
const csInterface = main.getCSInterface();

windowCEP.cutoutExport = function (): void {
    const config = Utils.getJson<ExportOptions>(csInterface, "config");
    let showOpenDialogFun = cep.fs.showOpenDialogEx;
    if (!showOpenDialogFun) {
        showOpenDialogFun = cep.fs.showOpenDialog;
    }
    const dialogData = showOpenDialogFun(false, true, "选择切图导出目录", config.outPath);
    const path = dialogData.data[0];
    if (path) {
        const quality = window.document.getElementById("quality") as HTMLInputElement;
        const allPsd = window.document.getElementById('all-psd') as HTMLInputElement;
        const option: ExportOptions = {
            outPath: path,
            quality: parseInt(quality.value),
            isAllPsd: allPsd.checked
        };
        Utils.writeJson(csInterface, "config", option);
        csInterface.evalScript(`cutoutExport(${JSON.stringify(option)});`);
    }
}
