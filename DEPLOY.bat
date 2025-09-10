@echo off
echo.
echo ========================================
echo   JAIME'S BIRTHDAY SITE DEPLOYMENT
echo ========================================
echo.
echo This will deploy your site to GitHub Pages!
echo.
echo Choose deployment method:
echo 1. Simple deployment (recommended)
echo 2. Advanced deployment
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    powershell.exe -ExecutionPolicy Bypass -File deploy-simple.ps1
) else (
    powershell.exe -ExecutionPolicy Bypass -File deploy.ps1
)

pause
