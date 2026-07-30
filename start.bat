@echo off
title EKRS AI -- Full Enterprise Platform Launcher (Gemma-4-12B + Backend + Frontend)
cd /d "%~dp0"

cls
echo =========================================================================
echo   EKRS AI -- Enterprise Knowledge Retrieval ^& Zero-Trust Governance
echo =========================================================================
echo.

echo [*] Initializing EKRS Enterprise Services...
echo -------------------------------------------------------------------------

:: 1. Check Node.js runtime
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js not detected in PATH. Please install Node.js v18+.
    pause
    exit /b 1
)
echo [OK] Node.js Runtime detected.

:: 2. Ensure dependencies and backend build
if not exist "dist\index.js" (
    echo [*] Compiling EKRS TypeScript Backend...
    call npm run build
)

if not exist "frontend\node_modules\" (
    echo [*] Installing Frontend UI dependencies...
    call npm --prefix frontend install
)

echo [OK] Project dependencies and TypeScript build verified.
echo -------------------------------------------------------------------------
echo.

:: 3. Launch Llama.cpp CUDA Server hosting Gemma 4 12B Model on Port 8085
echo [1/3] Launching Llama.cpp CUDA Server hosting Gemma 4 12B IT (Port 8085)...
set "LLAMA_EXE=C:\Users\Parth\Desktop\whisper\third_party\llama-cpp-bin\llama-server.exe"
set "GEMMA_MODEL=C:\Users\Parth\.cache\huggingface\hub\models--unsloth--gemma-4-12b-it-GGUF\snapshots\3f09de26549e6d7ea54f1b83755149f840fcd333\gemma-4-12b-it-UD-Q4_K_XL.gguf"

if exist "%LLAMA_EXE%" (
    if exist "%GEMMA_MODEL%" (
        start "EKRS Llama.cpp CUDA (Gemma-4-12B)" cmd /k ""%LLAMA_EXE%" -m "%GEMMA_MODEL%" -c 4096 --port 8085 -ngl 99"
        echo     [OK] Llama.cpp CUDA Server launched on Port 8085 with Gemma 4 12B IT.
    ) else (
        echo     [!] Gemma 4 12B GGUF model file not found. Starting with Fallback engine.
    )
) else (
    echo     [!] llama-server.exe not found. Starting with Fallback engine.
)

:: 4. Launch EKRS Backend API Server on Port 8080
echo [2/3] Launching EKRS Node.js Backend API Server (Port 8080)...
start "EKRS Backend API Server (Port 8080)" cmd /k "npm run server:backend"
echo     [OK] EKRS Backend API Server launched on Port 8080.

:: 5. Launch EKRS Frontend UI on Port 3000 & open browser
echo [3/3] Launching EKRS Vite Frontend UI (Port 3000)...
echo.
echo =========================================================================
echo   [!] All 3 Services Initialized:
echo       1. Llama.cpp CUDA Server (Port 8085 -- Gemma-4-12B)
echo       2. Node.js Backend API  (Port 8080 -- Zero-Trust Retrieval Engine)
echo       3. Vite Frontend UI     (Port 3000 -- User Workspace)
echo.
echo   Opening http://localhost:3000 in your browser...
echo =========================================================================
echo.

:: Auto-open browser after 3 seconds
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: Run Frontend in main console window
call npm --prefix frontend run dev

if %errorlevel% neq 0 (
    echo.
    echo [!] Frontend server stopped with code %errorlevel%.
    pause
)
