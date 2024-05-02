@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0

cd jsProject
if not exist "%curPath%jsProject/node_modules" (
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