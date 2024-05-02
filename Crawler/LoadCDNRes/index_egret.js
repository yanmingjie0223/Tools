const fsUtils = require('./src/utils/fs_utils');
const config = require('./load.config');
const crawler = require('./src/crawler');

main();

function main() {
    fsUtils.deleteFolder(config.outDir);
    const jsonStr = fsUtils.readFile(config.egret_res_json);
    const resJosn = JSON.parse(jsonStr);

    let dirnameArr;
    let dirname;
    let filename;
    const resources = resJosn.resources;
    for (let i = 0, len = resources.length; i < len; i++) {
        filename = resources[i].url;
        // 创建文件
        dirnameArr = filename.split('/');
        dirnameArr.pop();
        dirname = dirnameArr.join('/');
        fsUtils.createFolder(config.outDir + dirname);
        // 下载和写文件
        crawler.queue({
            uri: config.egret_root + filename,
            filename: config.outDir + filename
        });
    }
}