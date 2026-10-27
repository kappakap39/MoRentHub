@echo off
chcp 65001 > nul
title MoRentHub - Docker Compose
cd /d "%~dp0"
cls
echo ==========================================================
echo        MoRentHub - Docker Compose Starter
echo ==========================================================
echo.
echo [INFO] Running: docker compose up --build ...
echo [INFO] Please make sure Docker Desktop is open and running.
echo.
docker compose up --build
echo.
echo [INFO] Docker process finished.
pause
