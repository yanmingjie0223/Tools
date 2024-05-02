const fsUtils = require('./src/utils/fs_utils');
const uuidUtils = require('./src/cocos/uuid');
const crawler = require('./src/crawler');
const settings = require('./config/settings');
const config = require('./load.config');

main();

function main() {
    fsUtils.deleteFolder(config.outDir);
    const version = getRealAsset();

    let fileDir;
    let filename;
    for (const key in version) {
        if (version.hasOwnProperty(key)) {
            // 创建文件
            fileDir = 'res/raw-assets/' + key.substr(0, 2);
            filename = fileDir + '/' + key;
            fsUtils.createFolder(config.outDir + fileDir);
            // 下载和写文件
            crawler.queue({
                uri: config.cocos_root + filename,
                filename: config.outDir + filename
            });
        }
    }
}

function getRealAsset() {
    const uuids = settings.uuids
    const rawAssets = settings.rawAssets;
    const assetTypes = settings.assetTypes;
    const realRawAssets = settings.rawAssets = {};
    const md5RawAssets = settings.md5AssetsMap["raw-assets"];
    const md5 = md5RawAssets && md5RawAssets.length > 0 ? true : false;
    for (let mount in rawAssets) {
        const entries = rawAssets[mount];
        for (let id in entries) {
            const entry = entries[id];
            const type = entry[1];
            // retrieve minified raw asset
            if (typeof type === 'number') {
                entry[1] = assetTypes[type];
            }
            // retrieve uuid
            const uuid = uuids[id] || id;
            let url = uuid;
            if (md5) {
                const index = md5RawAssets.indexOf(uuid);
                if (index === -1) {
                    continue;
                }
                url = uuidUtils.decodeUuid(uuid) + '.' + md5RawAssets[index + 1];
            }
            url += '.' + entry[0].split('.')[1];
            realRawAssets[url] = entry;
        }
    }
    return realRawAssets;
}