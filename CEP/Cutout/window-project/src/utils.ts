export default class Utils {

	/**
	 * 这里是指插件目录下的 jsx 文件夹，可自行设为任意目录
	 * 动态添加注册jsx文件
	 * @param {CSInterface} csInterface
	 * @param {string} fileName
	 */
	public static loadJSX(csInterface: CSInterface, fileName: string): void {
		const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
		csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
	}

	/**
	 * 创建文件夹
	 * @param {string} path
	 */
	public static createDir(path: string): void {
		const dirInfo = cep.fs.stat(path);
		if (dirInfo.err !== 0) {
			cep.fs.makedir(path);
		}
	}

	/**
	 * 获取json数据
	 * @param csInterface 
	 * @param name 
	 * @returns 
	 */
	public static getJson<T>(csInterface: CSInterface, name: string): T {
		const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/js/";
		const rtObj = cep.fs.readFile(`${extensionRoot}${name}.json`);
		return JSON.parse(rtObj.data);
	}

	/**
	 * 写入json
	 * @param csInterface 
	 * @param name 
	 * @param content 
	 */
	public static writeJson(csInterface: CSInterface, name: string, content: any): void {
		const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/js/";
		cep.fs.writeFile(`${extensionRoot}${name}.json`, JSON.stringify(content));
	}

}
