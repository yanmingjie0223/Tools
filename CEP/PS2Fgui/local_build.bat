@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0
set psPath=""
set cp=""

@REM 检查64位系统注册表路径
for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\photoshop.exe" /ve 2^>nul ^| find "REG_SZ"') do (
    set cp=%%b
    set psPath=!cp:~0,-13!
)

@REM 如果未找到，检查32位系统注册表路径
if not defined psPath (
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\App Paths\photoshop.exe" /ve 2^>nul ^| find "REG_SZ"') do (
        set cp=%%b
        set psPath=!cp:~0,-13!
    )
)

echo %psPath%
if defined psPath (
    xcopy /s /i /y "%curPath%com.pq.ps2fgui" "%psPath%Required\CEP\extensions\com.pq.ps2fgui"
) else ("
    echo "not found Adobe, download photoshop please!"
    goto toEnd
)

echo end
endlocal
exit

:toEnd
pause
endlocal
exit