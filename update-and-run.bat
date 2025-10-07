@echo off
echo ====================================
echo  Vita Coco Photobooth - Update Script
echo ====================================
echo.

echo [1/4] Pulling latest changes from git...
git pull
if errorlevel 1 (
    echo ERROR: Git pull failed!
    pause
    exit /b 1
)
echo.

echo [2/4] Installing dependencies...
call npm install
echo.

echo [3/4] Building Electron app...
call npm run electron:build:win
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [4/4] Launching Vita Photobooth...
echo.
echo ====================================
echo  Build complete! Starting app...
echo ====================================
echo.

cd release\win-unpacked
start "" "Vita.exe"
cd ..\..

echo.
echo App launched! You can close this window.
timeout /t 3

