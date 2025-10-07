@echo off
echo ====================================
echo  Vita Coco Photobooth - CLEAN UPDATE
echo  (Full refresh with cache clear)
echo ====================================
echo.

echo [1/7] Stashing any local changes...
git stash
echo.

echo [2/7] Pulling latest code...
git pull
if errorlevel 1 (
    echo ERROR: Git pull failed!
    pause
    exit /b 1
)
echo.

echo [3/7] Cleaning old build artifacts...
if exist dist rmdir /s /q dist
if exist release rmdir /s /q release
echo Build folders cleaned!
echo.

echo [4/7] Cleaning npm cache...
if exist node_modules rmdir /s /q node_modules
echo Node modules cleaned!
echo.

echo [5/7] Fresh npm install...
call npm install
echo.

echo [6/7] Building Electron app from scratch...
call npm run electron:build:win
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [7/7] Launching Vita Photobooth...
echo.
echo ====================================
echo  CLEAN BUILD COMPLETE!
echo ====================================
echo.

cd release\win-unpacked
start "" "Vita.exe"
cd ..\..

echo.
echo App launched! This was a completely fresh build.
timeout /t 3

