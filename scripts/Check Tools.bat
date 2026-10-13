@echo off
setlocal
where node.exe >nul 2>nul
if errorlevel 1 goto upgrade
where npm.cmd >nul 2>nul
if errorlevel 1 goto upgrade
node "%~dp0check-tools.js"
if errorlevel 1 goto upgrade
exit /b 0
:upgrade
echo.
echo Install the current Node.js LTS for Windows from https://nodejs.org
echo Choose the default options, including npm and Add to PATH.
echo Close old command windows, then run the player BAT file again.
echo If old versions still appear, check for duplicate installations:
echo   where node
echo   where npm
echo Remove outdated Node.js installations or outdated npm entries from PATH.
exit /b 1
