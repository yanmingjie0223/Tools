const Crawler = require("crawler");
const { AppConfig } = require("../config/AppConfig");
const crawler = createCrawler();
const datas = [];
let loadCallback;
let curCount;
let currSearchTitle;

function createCrawler() {
    const c = new Crawler({
        encoding: null,
        jQuery: false, // set false to suppress warning message.
        callback: function (err, res, done) {
            if (err) {
                console.error(err.stack);
                errorEnd();
            }
            else {
                // fs.createWriteStream(res.options.filename).write(res.body);
                parse(res.body.toString());
            }

            done();
        }
    });
    return c;
}

function loadSearch(searchTitle, callback) {
    currSearchTitle = searchTitle;
    datas.length = 0;
    curCount = 0;
    loadCallback = callback;
    loadSearchPage();
}

function loadSearchPage() {
    if (curCount >= AppConfig.maxCount && loadCallback) {
        datas.sort(downloadCountSort);
        loadCallback(datas);
        return;
    }
    const encodeTitle = encodeURI(currSearchTitle);
    const curUrl = `${AppConfig.root}?from=${curCount}&kw=${encodeTitle}&limit=10&${AppConfig.rootXUA}`;
    crawler.queue({ uri: curUrl });
}

function downloadCountSort(a, b) {
    const aM = Date.parse(a.downloadCount);
    const bM = Date.parse(b.downloadCount);
    return bM - aM;
}

function trimSpace(str) {
    return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
}

function parse(html) {
    const requstData = JSON.parse(html);
    if (requstData.data && requstData.data.list) {
        const list = requstData.data.list;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const item = list[i];
            const tags = item.tags;
            let types = '';
            for (let k = 0, kLen = tags.length; k < kLen; k++) {
                if (types) {
                    types += `|${tags[k].value}`;
                }
                else {
                    types += `${tags[k].value}`;
                }
            }
            const xlsxData = {
                gameName: item.title,
                score: item.stat.rating.score,
                type: types,
                downloadCount: item.stat.download_count,
                author: item.author,
                url: `https://www.taptap.com/app/${item.event_log.paramId}`
            };
            datas.push(xlsxData);
        }
        curCount += len;
        if (len < 10) {
            errorEnd();
        }
        else {
            loadSearchPage();
        }
    }
    else {
        errorEnd();
    }
}

function errorEnd() {
    curCount = AppConfig.maxCount;
    loadSearchPage();
}

module.exports = {
    loadSearch: loadSearch
}