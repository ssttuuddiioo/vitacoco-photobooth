@echo off
echo ====================================
echo  FORCE UPDATE - Hard Reset to Latest
echo ====================================
echo.
echo WARNING: This will discard ALL local changes!
echo Press Ctrl+C to cancel, or
pause
echo.

echo [1/6] Fetching latest from GitHub...
git fetch origin
echo.

echo [2/6] Hard resetting to origin/master...
git reset --hard origin/master
echo.

echo [3/6] Showing current commit (should match GitHub):
git log --oneline -1
echo.

echo [4/6] Cleaning build folders...
if exist dist rmdir /s /q dist
if exist release rmdir /s /q release
echo.

echo [5/6] Building fresh...
call npm run electron:build:win
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [6/6] Launching...
cd release\win-unpacked
start "" "Vita.exe"
cd ..\..
echo.
echo Done! Check DevTools console for debug logs.
timeout /t 3

