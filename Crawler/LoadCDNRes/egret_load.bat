@echo off

set curPath=%~dp0

if not exist "%curPath%node_modules" (
    call npm install
)
if not exist "%curPath%node_modules" (
    echo "请先下载安装nodejs 地址：http://nodejs.cn/"
    goto toEnd
)

call node index_egret.js

echo end
exit

:toEnd
pause
exit