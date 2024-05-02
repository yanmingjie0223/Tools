const crawler = require('./src/crawler');
const fs = require('fs');
const xlsx = require('node-xlsx');
const fs_utils = require('./src/utils/fs_utils');
const { AppConfig } = require('./config/AppConfig');

const xlsxData = [];
const outDir = AppConfig.outDir;
const outFileName = AppConfig.outFileName;
const searchs = AppConfig.searchs;
let searchIndex = -1;

function main() {
    nextLoad();
}

function nextLoad() {
    ++searchIndex;
    if (searchs.length === searchIndex) {
        writeData();
        return;
    }

    const searchTitle = searchs[searchIndex];
    console.log(`${searchTitle} 数据载入中...`);
    crawler.loadSearch(searchTitle, loadComplete);
}

function loadComplete(datas) {
    const curXlsx = {};
    curXlsx.name = searchs[searchIndex];
    curXlsx.data = [
        ['游戏名', '评分', '类型', '下载次数', '开发商', 'taptap地址']
    ]
    for (let i = 0; i < datas.length; i++) {
        const listData = datas[i];
        curXlsx.data.push(
            [
                listData.gameName,
                listData.score,
                listData.type,
                listData.downloadCount,
                listData.author,
                listData.url
            ]
        );
    }
    xlsxData.push(curXlsx);
    nextLoad();
}

function writeData() {
    const buffer = xlsx.build(xlsxData);
    fs_utils.createFolder(outDir);
    fs.writeFileSync(`${outDir}/${outFileName}`, buffer, "binary");
}

main();