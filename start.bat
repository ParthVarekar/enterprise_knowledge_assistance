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
echo [1/3] Launching Llama.cpp CUDA Server (Port 8085 -- Gemma 4 12B IT)...
set "LLAMA_EXE=C:\Users\Parth\Desktop\whisper\third_party\llama-cpp-bin\llama-server.exe"
set "GEMMA_12B=C:\Users\Parth\.cache\huggingface\hub\models--unsloth--gemma-4-12b-it-GGUF\blobs\ee33ab5be8e07aca1c269fc645eaed5f3298e089d52db29415839d8f29957020"
set "GEMMA_E4B=C:\Users\Parth\.cache\huggingface\hub\models--unsloth--gemma-4-E4B-it-GGUF\blobs\30d1e7949597a3446726064e80b876fd1b5cba4aa6eec53d27afa420e731fb36"

if exist "%LLAMA_EXE%" (
    if exist "%GEMMA_12B%" (
        echo     [+] Loading Gemma 4 12B IT model (26 GPU layers, ~4.8GB VRAM allocated)...
        start "EKRS Llama.cpp CUDA (Gemma-4-12B)" cmd /k ""%LLAMA_EXE%" -m "%GEMMA_12B%" -c 4096 --port 8085 -ngl 26"
        echo     [OK] Llama.cpp CUDA Server launched on Port 8085.
    ) else if exist "%GEMMA_E4B%" (
        echo     [+] Loading Gemma 4 E4B IT model (Full GPU VRAM)...
        start "EKRS Llama.cpp CUDA (Gemma-4-E4B)" cmd /k ""%LLAMA_EXE%" -m "%GEMMA_E4B%" -c 4096 --port 8085 -ngl 99"
        echo     [OK] Llama.cpp CUDA Server launched on Port 8085.
    ) else (
        echo     [!] Gemma model GGUF blob not found. Starting with built-in Fallback engine.
    )
) else (
    echo     [!] llama-server.exe not found. Starting with built-in Fallback engine.
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
echo       1. Llama.cpp CUDA Server (Port 8085 -- Gemma 4 12B IT)
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
