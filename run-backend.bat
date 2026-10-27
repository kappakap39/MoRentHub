@echo off
chcp 65001 > nul
title MoRentHub - Backend API
cd /d "%~dp0backend"
cls
echo ==========================================================
echo        MoRentHub - Starting Backend API on Port 5000
echo ==========================================================
echo.
npm run dev
pause
