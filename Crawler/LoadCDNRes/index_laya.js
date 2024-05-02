const fsUtils = require("./src/utils/fs_utils");
const config = require("./load.config");
const crawler = require("./src/crawler");

main();

function main() {
	fsUtils.deleteFolder(config.outDir);
	const versionStr = fsUtils.readFile(config.laya_version);
	const version = JSON.parse(versionStr);

	let dirnameArr;
	let dirname;
	let filename;
	for (const key in version) {
		if (version.hasOwnProperty(key)) {
			filename = version[key].split("?")[0];
			// 创建文件
			dirnameArr = filename.split("/");
			dirnameArr.pop();
			dirname = dirnameArr.join("/");
			fsUtils.createFolder(config.outDir + dirname);
			// 下载和写文件
			crawler.queue({
				uri: config.laya_root + filename,
				filename: config.outDir + filename,
			});
		}
	}
}
