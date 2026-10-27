@echo off
chcp 65001 > nul
title MoRentHub - Full-stack Dev Runner
cd /d "%~dp0"
cls
echo ==========================================================
echo        MoRentHub - Starting Backend API and Frontend React
echo ==========================================================
echo.
echo [1/3] Starting Backend API on Port 5000 ...
start "MoRentHub - Backend API" cmd /k "cd /d ""%~dp0backend"" && npm run dev"

echo [2/3] Starting Frontend React on Port 3000 ...
start "MoRentHub - Frontend React" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo [3/3] Waiting for servers to initialize ...
timeout /t 5 /nobreak > nul

echo.
echo [INFO] Opening web browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ==========================================================
echo   MoRentHub is now running at: http://localhost:3000
echo   To stop servers, simply close the opened Command Prompt windows.
echo ==========================================================
echo.
pause
