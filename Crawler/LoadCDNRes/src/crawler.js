const Crawler = require("crawler");
const fs = require('fs');
const crawler = createCrawler();

function createCrawler() {
    const c = new Crawler({
        encoding: null,
        jQuery: false, // set false to suppress warning message.
        callback: function(err, res, done) {
            if(err){
                console.error(err.stack);
            }
            else{
                fs.createWriteStream(res.options.filename).write(res.body);
            }

            done();
        }
    });
    return c;
}

module.exports = crawler;