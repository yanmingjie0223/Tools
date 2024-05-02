const fs = require('fs');
const config = require('../../load.config');

changeSetting();

function changeSetting() {
    const bin = fs.readFileSync(config.cocos_settings);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    let jsStr = bin.toString('utf-8');
    jsStr = jsStr.replace(/window._CCSettings/g, 'module.exports');

    fs.writeFileSync(config.cocos_settings, jsStr);
}