@echo off
title EKRS AI -- Full Enterprise Platform Launcher (Gemma-4-E4B CUDA + Backend + Frontend)
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

:: 2. Ensure model is present (auto-download or prepare if missing)
echo [*] Verifying optimal model for RTX 5050 GPU (Gemma 4 E4B IT)...
python scripts\ensure_model.py
if %errorlevel% neq 0 (
    echo [!] Warning: Model preparation script encountered an issue. Proceeding with fallback.
)

:: 3. Ensure project dependencies ^& TypeScript build
if not exist "dist\index.js" (
    echo [*] Compiling EKRS TypeScript Backend...
    call npm run build
)

if not exist "frontend\node_modules\" (
    echo [*] Installing Frontend UI dependencies...
    call npm --prefix frontend install
)

echo [OK] Environment verified.
echo -------------------------------------------------------------------------
echo.

:: 4. Launch Llama.cpp CUDA Server hosting Gemma 4 E4B IT Model on Port 8085
echo [1/3] Launching Llama.cpp CUDA Server (Port 8085 -- Gemma 4 E4B IT)...
set "LLAMA_EXE=C:\Users\Parth\Desktop\whisper\third_party\llama-cpp-bin\llama-server.exe"
set "MODEL_PATH=models\gemma-4-E4B-it.gguf"

if exist "%LLAMA_EXE%" (
    if exist "%MODEL_PATH%" (
        echo     [+] Offloading 100 percent model layers to RTX 5050 CUDA GPU VRAM...
        start "EKRS Llama.cpp CUDA (Gemma-4-E4B)" cmd /k ""%LLAMA_EXE%" -m "%MODEL_PATH%" -c 4096 --port 8085 -ngl 99"
        echo     [OK] Llama.cpp CUDA Server launched on Port 8085.
    ) else (
        echo     [!] %MODEL_PATH% not found. Launching with built-in Fallback engine.
    )
) else (
    echo     [!] llama-server.exe not found. Launching with built-in Fallback engine.
)

:: 5. Launch EKRS Backend API Server on Port 8080
echo [2/3] Launching EKRS Node.js Backend API Server (Port 8080)...
start "EKRS Backend API Server (Port 8080)" cmd /k "npm run server:backend"
echo     [OK] EKRS Backend API Server launched on Port 8080.

:: 6. Launch EKRS Frontend UI on Port 3000 ^& open browser
echo [3/3] Launching EKRS Vite Frontend UI (Port 3000)...
echo.
echo =========================================================================
echo   [!] All 3 Services Initialized:
echo       1. Llama.cpp CUDA Server (Port 8085 -- Gemma-4-E4B 100 percent VRAM Offload)
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
