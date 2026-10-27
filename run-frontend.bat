@echo off
chcp 65001 > nul
title MoRentHub - Frontend React
cd /d "%~dp0frontend"
cls
echo ==========================================================
echo        MoRentHub - Starting Frontend React on Port 3000
echo ==========================================================
echo.
npm run dev
pause
