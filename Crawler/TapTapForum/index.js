const crawler = require('./src/crawler');
const fs = require('fs');
const xlsx = require('node-xlsx');
const fs_utils = require('./src/utils/fs_utils');
const { AppConfig } = require('./config/AppConfig');

const xlsxData = [];
const outDir = AppConfig.outDir;
const outFileName = AppConfig.outFileName;
const root = AppConfig.root;
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

    console.log(`${searchs[searchIndex]} 数据载入中...`);
    const curUrl = encodeURI(`${root}${searchs[searchIndex]}`);
    crawler.loadSearch(curUrl, loadComplete);
}

function loadComplete(datas) {
    const curXlsx = {};
    curXlsx.name = searchs[searchIndex];
    curXlsx.data = [
        ['时间', '标题', '文本内容', '地址']
    ]
    for (let i = 0; i < datas.length; i++) {
        const listData = datas[i];
        curXlsx.data.push(
            [
                listData.time,
                listData.title,
                listData.content,
                listData.href
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