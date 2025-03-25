declare const cep: {
    fs: {
        showOpenDialog(allowMultipleSelection: boolean, isDir: boolean, title: string, path: string): { data: string[] };
        stat(path: string): { err: number };
        makedir(path: string): void;
        readFile(filePath: string): { err: string, data: string };
        writeFile(filePath: string, content: string): void
    }
};
declare class SystemPath {
    public static USER_DATA: string;
    public static COMMON_FILES: string;
    public static MY_DOCUMENTS: string;
    public static APPLICATION: string;
    public static EXTENSION: string;
    public static HOST_APPLICATION: string;
}
declare class CSInterface {
    public addEventListener(eventName: string, callback: Function): void;
    public evalScript(scriptStr: string): void;
    public getSystemPath(path: string): void;
}
interface CSXSEvent {
    type: string;
    data: string;
}
interface ExportOptions {
    /**
     * 导出路径
     */
    outPath: string;
    /**
     * 导出品质
     */
    quality: number;
    /**
     * 是否导出所有打开psd文件
     */
    isAllPsd: boolean;
}