@echo off
chcp 65001 > nul
title MoRentHub - Stop Docker
cd /d "%~dp0"
cls
echo ==========================================================
echo        MoRentHub - Stopping Docker Containers
echo ==========================================================
echo.
echo [INFO] Running: docker compose down ...
docker compose down
echo.
echo [INFO] All containers stopped successfully.
pause
