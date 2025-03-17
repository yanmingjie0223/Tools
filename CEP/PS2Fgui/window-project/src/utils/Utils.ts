export default class Utils {
	/**
	 * 这里是指插件目录下的 jsx 文件夹，可自行设为任意目录
	 * 动态添加注册jsx文件
	 * @param {CSInterface} csInterface
	 * @param {string} fileName
	 */
	public static loadJSX(csInterface: CSInterface, fileName: string): void {
		var extensionRoot =
			csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
		csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
	}

	/**
	 * 获取fgui唯一id规则
	 */
	public static genBuildId(): string {
		var magicNumber = Math.floor(Math.random() * 36)
			.toString(36)
			.substr(0, 1);
		var s1 = "0000" + Math.floor(Math.random() * 1679616).toString(36);
		var s2 = "000" + Math.floor(Math.random() * 46656).toString(36);
		var count = 0;
		for (var i = 0; i < 4; i++) {
			var c = Math.floor(Math.random() * 26);
			count += Math.pow(26, i) * (c + 10);
		}
		count +=
			Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 222640);

		return (
			magicNumber +
			s1.substr(s1.length - 4) +
			s2.substr(s2.length - 3) +
			count.toString(36)
		);
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
}
