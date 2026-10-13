@echo off
rem PATH changes stay inside the calling launcher's SETLOCAL scope.
if exist "%~dp0..\.tools\node\node.exe" goto activate
echo Preparing a private Node.js runtime. Your installed Node.js will stay unchanged.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0prepare-node.ps1"
if errorlevel 1 exit /b 1
:activate
set "PATH=%~dp0..\.tools\node;%PATH%"
call "%~dp0Check Tools.bat"
exit /b %errorlevel%
