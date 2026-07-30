@echo off
title EKRS AI — Enterprise Knowledge Retrieval ^& Governance System
cd /d "%~dp0"

cls
echo =========================================================================
echo   EKRS AI -- Enterprise Knowledge Retrieval ^& Zero-Trust Governance
echo =========================================================================
echo.

echo [*] Initializing EKRS Enterprise Environment...
echo -------------------------------------------------------------------------

:: Check Node.js runtime
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js not detected in PATH. Please install Node.js v18+.
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js Runtime detected.

:: Check Llama.cpp CUDA Server Status (Port 8085)
curl -s http://127.0.0.1:8085/health >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Llama.cpp CUDA Server ACTIVE on http://127.0.0.1:8085
) else (
    echo [i] Local Llama.cpp server on port 8085 offline. Active Fallback Engine ready.
)

:: Ensure frontend dependencies are installed
if not exist "frontend\node_modules\" (
    echo [*] Installing frontend UI dependencies...
    call npm --prefix frontend install
)

echo [OK] EKRS Engine ^& Frontend UI configured successfully.
echo -------------------------------------------------------------------------
echo.
echo [!] Launching EKRS Frontend UI on http://localhost:3000...
echo     (Keep this console window open while using EKRS AI)
echo.

:: Auto-open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Execute Vite Dev Server (using call so batch window stays open)
call npm --prefix frontend run dev

if %errorlevel% neq 0 (
    echo.
    echo [!] Server stopped with exit code %errorlevel%.
    pause
)
