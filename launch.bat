@echo off
title ALTTP Randomizer Tracker Setup

echo ================================================
echo   ALTTP Randomizer Community Tracker
echo   Desktop App Setup
echo ================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo   https://nodejs.org
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

:: Check if tracker files exist
if not exist "tracker\index.html" (
    echo [ERROR] Tracker files not found in tracker\ folder!
    echo.
    echo Please copy your tracker files into the tracker\ subfolder.
    echo The tracker\ folder should contain index.html at its root.
    echo.
    echo Download tracker files from:
    echo   https://github.com/KrisDavie/alttptracker
    echo   Click Code - Download ZIP, extract into the tracker\ folder
    echo.
    pause
    exit /b 1
)

echo [OK] Tracker files found.
echo.

:: Install dependencies if needed
if not exist "node_modules\electron" (
    echo Installing dependencies - this may take a minute...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] npm install failed. Check your internet connection.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed.
    echo.
)

echo Starting ALTTP Randomizer Tracker...
echo.
call npm start
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] App failed to start. Error code: %errorlevel%
    echo.
    pause
)
