@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0
set cepPath="%APPDATA%/Adobe\CEP\extensions"

if exist "%cepPath%" (
    xcopy /c /e /r /y %curPath%com.genii.cutout %cepPath%\com.genii.cutout
) else (
    echo "未存在adobe 请先安装photoshop!"
    goto toEnd
)

echo end
endlocal
exit

:toEnd
pause
endlocal
exit