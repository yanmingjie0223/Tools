const fs = require('fs');

function createFolder(path) {
    const pathArr = path.split('/');
    let dirPath = '.';
    for (let i = 0, len = pathArr.length; i < len; i++) {
        dirPath = dirPath + '/' + pathArr[i];
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    }
}

function deleteFolder(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            const curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function readFile(pathname) {
    const bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}

module.exports = {
    createFolder: createFolder,
    deleteFolder: deleteFolder,
    readFile: readFile
}