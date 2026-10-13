@echo off
setlocal
cd /d "%~dp0"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js LTS from https://nodejs.org then run this file again.
  pause
  exit /b 1
)
if not exist node_modules\electron\dist\electron.exe (
  call npm.cmd ci
  if errorlevel 1 goto failed
)
call npm.cmd start
if errorlevel 1 goto failed
exit /b 0
:failed
echo Player could not start. See the error above.
pause
exit /b 1
