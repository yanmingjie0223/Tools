declare const cep: any;
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