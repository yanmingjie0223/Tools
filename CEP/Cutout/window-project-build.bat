@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0

cd window-project
if not exist "%curPath%window-project/node_modules" (
    call npm install
)
call npm run build

echo end
endlocal
exit

:toEnd
pause
endlocal
exit