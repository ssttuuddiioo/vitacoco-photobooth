@echo off
echo ====================================
echo  DIAGNOSTIC - Git and Build Status
echo ====================================
echo.

echo [1] Current directory:
cd
echo.

echo [2] Git branch:
git branch
echo.

echo [3] Last 3 commits (local):
git log --oneline -3
echo.

echo [4] Git status:
git status
echo.

echo [5] Remote status (checking for updates):
git fetch origin
git log HEAD..origin/master --oneline
echo.

echo [6] Checking key file modification time:
echo capture-countdown-screen.tsx:
if exist src\components\screens\capture-countdown-screen.tsx (
    dir src\components\screens\capture-countdown-screen.tsx | find "/"
) else (
    echo FILE NOT FOUND!
)
echo.

echo [7] Checking if build exists:
if exist release\win-unpacked\Vita.exe (
    echo Vita.exe EXISTS
    dir release\win-unpacked\Vita.exe | find "/"
) else (
    echo Vita.exe NOT FOUND - need to build!
)
echo.

echo ====================================
echo  FORCE UPDATE COMMANDS:
echo ====================================
echo If nothing above shows new commits, run:
echo.
echo   git fetch origin
echo   git reset --hard origin/master
echo   npm run electron:build:win
echo.
pause

