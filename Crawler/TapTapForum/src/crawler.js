const Crawler = require("crawler");
const cheerio = require('cheerio');
const { AppConfig } = require("../config/AppConfig");
const crawler = createCrawler();
const datas = [];
const currDatas = [];
let loadCallback;
let loadUrl;
let curPage;

function createCrawler() {
    const c = new Crawler({
        encoding: null,
        jQuery: false, // set false to suppress warning message.
        callback: function (err, res, done) {
            if (err) {
                console.error(err.stack);
                ++curPage;
                loadSearchPage();
            }
            else {
                // fs.createWriteStream(res.options.filename).write(res.body);
                currDatas.length = 0;
                parse(res.body.toString());
                ++curPage;
                loadSearchPage();
            }

            done();
        }
    });
    return c;
}

function loadSearch(url, callback) {
    datas.length = 0;
    curPage = 1;
    loadUrl = url;
    loadCallback = callback;
    loadSearchPage();
}

function loadSearchPage() {
    if (curPage > AppConfig.maxPage && loadCallback) {
        datas.sort(timeSort);
        loadCallback(datas);
        return;
    }
    const curUrl = `${loadUrl}?page=${curPage}`;
    crawler.queue({ uri: curUrl });
}

function timeSort(a, b) {
    const aM = Date.parse(a.time);
    const bM = Date.parse(b.time);
    return bM - aM;
}

function trimSpace(str) {
    return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
}

function parse(html) {
    const pHtml = cheerio.load(html);
    const times = pHtml('div.moment-publish-info');
    const items = pHtml('div.moment-content-box');
    items.each((index, item) => {
        const itemElement = pHtml(item).find('div.item-content');
        const ctElement = pHtml(itemElement).find('p.content-text');
        const childs = pHtml(itemElement).children('div')
        const titleAElement = pHtml(childs[1]).find('a');
        const ctAElement = pHtml(ctElement).find('a');
        const title = pHtml(titleAElement).text();
        const text = pHtml(ctAElement).text();
        const href = pHtml(titleAElement).attr('href');
        const data = {
            title: trimSpace(title),
            content: trimSpace(text),
            href: href,
            time: ''
        };
        currDatas.push(data);
    });
    times.each((index, item) => {
        const data = currDatas[index];
        const spanElement = pHtml(item).find('span');
        const time = pHtml(spanElement).text();
        if (data) {
            data['time'] = time;
        }
    });
    // 当页面没有数据时候，结束
    if (currDatas.length < 1) {
        curPage = AppConfig.maxPage;
    }
    datas.push(...currDatas);
}

module.exports = {
    loadSearch: loadSearch
}