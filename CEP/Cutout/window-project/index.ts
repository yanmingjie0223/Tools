import Main from "./src/main";

const windowCEP: any = window || {};
const main = new Main();
const csInterface = main.getCSInterface();
let defaultPath = "D:/"

windowCEP.cutoutExport = function(): void {
    const dialogData = cep.fs.showOpenDialog(false, true, "选择切图导出目录", defaultPath);
    const path = dialogData.data[0];
    if (path) {
        defaultPath = path;
        const quality = window.document.getElementById("quality") as HTMLInputElement;
        const allPsd = window.document.getElementById('all-psd') as HTMLInputElement;
        const option: ExportOptions = {
            outPath: path,
            quality: parseInt(quality.value),
            isAllPsd: allPsd.checked
        };
        csInterface.evalScript(`cutoutExport(${JSON.stringify(option)});`);
    }
}
