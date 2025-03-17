@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0

if not exist "%curPath%node_modules" (
    call npm install
)
call npm run win

echo end
endlocal
exit

:toEnd
pause
endlocal
exit