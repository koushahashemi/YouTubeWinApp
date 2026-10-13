@echo off
setlocal
cd /d "%~dp0"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js LTS from https://nodejs.org first.
  pause
  exit /b 1
)
echo Installing build tools...
call npm.cmd ci
if errorlevel 1 goto failed
echo Checking player controls...
call npm.cmd test
if errorlevel 1 goto failed
echo Building your Windows EXE. This can take a few minutes...
set ELECTRON_BUILDER_COMPRESSION_LEVEL=3
call npm.cmd run dist:win
if errorlevel 1 goto failed
echo Done: %cd%\dist\TubeMusicPlayer-1.0.0.exe
echo This portable EXE does not require Node.js to run.
start "" "%cd%\dist"
pause
exit /b 0
:failed
echo Build failed. See the error above.
pause
exit /b 1
