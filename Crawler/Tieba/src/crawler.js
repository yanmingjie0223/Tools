const Crawler = require("crawler");
const iconvLite = require('iconv-lite');
const fs = require('fs');
const cheerio = require('cheerio');
const { AppConfig } = require("../config/AppConfig");
const crawler = createCrawler();
const datas = [];
const currDatas = [];
let loadCallback;
let loadUrl;
let curPage;
/**页面数据防止 */
let pageData;

function createCrawler() {
    const c = new Crawler({
        encoding: null,
        jQuery: false, // set false to suppress warning message.
        callback: function (err, res, done) {
            if (err) {
                console.error(err.stack);
                ++curPage;
                nextSearchPage();
            }
            else {
                const str = getHtmlStr(res.body);
                // fs.createWriteStream('./dist/test.html').write(str);
                currDatas.length = 0;
                parse(str);
                ++curPage;
                nextSearchPage();
            }

            done();
        }
    });
    return c;
}

function getHtmlStr(b) {
    const str = b.toString();
    const gbk = str.indexOf('charset="GBK"');
    const gbk2 = str.indexOf('charset="gbk"');
    if (gbk !== -1 || gbk2 !== -1 ) {
        return iconvLite.decode(b, 'gbk');
    }
    return str;
}

function loadSearch(url, callback) {
    datas.length = 0;
    pageData = null;
    curPage = 1;
    loadUrl = url;
    loadCallback = callback;
    loadSearchPage();
}

function nextSearchPage() {
    const random = Math.random() * 1000 + AppConfig.pageLoadInterval;
    setTimeout(loadSearchPage, random);
}

function loadSearchPage() {
    if (curPage > AppConfig.maxPage && loadCallback) {
        datas.sort(timeSort);
        loadCallback(datas);
        return;
    }
    const curUrl = `${loadUrl}&pn=${curPage}`;
    // console.log(curPage, 'url: ', curUrl);
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
    const items = pHtml('div.s_post');
    items.each((index, item) => {
        const titleElement = pHtml(item).find('span.p_title');
        const titleAElement = pHtml(titleElement).find('a');
        const ctElement = pHtml(item).find('div.p_content');
        const fontElement = pHtml(item).find('font');
        const title = pHtml(titleAElement).text();
        const text = pHtml(ctElement).text();
        const href = pHtml(titleAElement).attr('href');
        const time = pHtml(fontElement[fontElement.length - 1]).text();
        const data = {
            title: trimSpace(title),
            content: trimSpace(text),
            href: `https://tieba.baidu.com/${href}`,
            time: time
        };
        if (!pageData) {
            pageData = data;
        }
        else {
            if (pageData.time === data.time && pageData.title === data.title) {
                curPage = AppConfig.maxPage;
                return;
            }
        }
        currDatas.push(data);
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