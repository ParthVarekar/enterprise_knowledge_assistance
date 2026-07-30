@echo off
setlocal enabledelayedexpansion
title EKRS AI — Enterprise Knowledge Retrieval & Governance System

:: Set ANSI colors
set "ESC="
set "CYAN=%ESC%[96m"
set "GREEN=%ESC%[92m"
set "YELLOW=%ESC%[93m"
set "MAGENTA=%ESC%[95m"
set "WHITE=%ESC%[97m"
set "GRAY=%ESC%[90m"
set "RESET=%ESC%[0m"

cls
echo %CYAN%=========================================================================%RESET%
echo %CYAN%  _____ _  CPS   ___ ___   _   ___   _____    ____                        %RESET%
echo %CYAN% | ____| |/ / _ \/ __| _ \ /_\ |_ _| / _ \ \  / /  \                       %RESET%
echo %CYAN% |  _| | ' <|   /\__ \   // _ \ | | | (_) \ \/ / () |                      %RESET%
echo %CYAN% |___|_|_|\_\_|_\|___/_|_/_/ \_\|___| \___/ \__/ \__/                       %RESET%
echo %MAGENTA%     Enterprise Knowledge Retrieval & Zero-Trust Governance Platform%RESET%
echo %CYAN%=========================================================================%RESET%
echo.

echo %WHITE%[*] Initializing EKRS Enterprise Environment...%RESET%
echo %GRAY%-------------------------------------------------------------------------%RESET%

:: Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo %YELLOW%[!] Node.js not detected in PATH. Please install Node.js v18+.%RESET%
    pause
    exit /b 1
)
echo %GREEN%[✓] Node.js Runtime detected.%RESET%

:: Check Llama.cpp CUDA Server Status (Port 8085)
curl -s http://127.0.0.1:8085/health >nul 2>nul
if %errorlevel% equ 0 (
    echo %GREEN%[✓] Llama.cpp CUDA Server ACTIVE on http://127.0.0.1:8085%RESET%
) else (
    echo %YELLOW%[i] Local Llama.cpp server on port 8085 offline. Active Fallback Engine ready.%RESET%
)

:: Ensure frontend dependencies are ready
if not exist "frontend\node_modules" (
    echo %YELLOW%[*] Installing frontend UI dependencies...%RESET%
    call npm --prefix frontend install
)

echo %GREEN%[✓] EKRS Engine & Frontend UI configured successfully.%RESET%
echo %GRAY%-------------------------------------------------------------------------%RESET%
echo.
echo %MAGENTA%[🚀] Launching EKRS Frontend UI on http://localhost:3000...%RESET%
echo %GRAY%    Press Ctrl+C in this console window to stop the server.%RESET%
echo.

:: Automatically open browser after 2 seconds in background
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Run Vite Dev Server
npm --prefix frontend run dev

pause
