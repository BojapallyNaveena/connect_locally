@echo off
title HyperLocal Connect Launcher
color 0A
echo.
echo  ===================================
echo   HyperLocal Connect - Starting...
echo  ===================================
echo.

echo  [1/2] Starting Backend Server...
start "HyperLocal Backend" /D "c:\Users\HP\OneDrive\consistency\backend" cmd /k node server.js

echo  Waiting 4 seconds...
timeout /t 4 /nobreak > nul

echo  [2/2] Starting Frontend...
start "HyperLocal Frontend" /D "c:\Users\HP\OneDrive\consistency\frontend" cmd /k npm run dev

echo  Waiting 5 seconds for frontend to compile...
timeout /t 5 /nobreak > nul

echo  Opening browser...
start http://localhost:5173

echo.
echo  Both servers are running!
echo  Keep the two black windows open.
echo  Press any key to close this window.
pause > nul