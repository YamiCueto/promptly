@echo off
echo ======================================
echo   Configuracion CORS para Ollama
echo ======================================
echo.
echo Este script configura Ollama para permitir conexiones desde GitHub Pages
echo.

REM Detener Ollama si está corriendo
taskkill /f /im ollama.exe 2>nul

echo 1. Configurando variables de entorno...
REM Permitir todos los origenes (para desarrollo)
setx OLLAMA_ORIGINS "*"

REM O permitir solo tu dominio de GitHub Pages (más seguro)
REM setx OLLAMA_ORIGINS "https://yamicueto.github.io"

REM Configurar host para escuchar en todas las interfaces
setx OLLAMA_HOST "0.0.0.0:11434"

echo.
echo 2. Variables configuradas:
echo    OLLAMA_ORIGINS = *
echo    OLLAMA_HOST = 0.0.0.0:11434
echo.
echo 3. Reiniciando Ollama...
timeout /t 2 /nobreak >nul

REM Iniciar Ollama con la nueva configuracion
start "" ollama serve

echo.
echo ✅ Ollama configurado con CORS habilitado
echo.
echo 🔧 Si sigues teniendo problemas, reinicia tu computadora
echo    para asegurar que las variables de entorno se carguen correctamente.
echo.
echo 🌐 Ahora puedes usar Promptly desde GitHub Pages:
echo    https://yamicueto.github.io/promptly
echo.
pause