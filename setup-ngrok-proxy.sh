#!/bin/bash
# Script para crear un proxy HTTPS para Ollama usando ngrok

echo "========================================"
echo "   Proxy HTTPS para Ollama con ngrok"
echo "========================================"
echo

# Verificar si ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok no está instalado."
    echo "📥 Descárgalo desde: https://ngrok.com/download"
    echo "📦 O instálalo con: brew install ngrok (macOS) o choco install ngrok (Windows)"
    exit 1
fi

echo "🚀 Iniciando proxy HTTPS para Ollama..."
echo "📍 Ollama debe estar corriendo en localhost:11434"
echo

# Crear tunnel HTTPS hacia Ollama
echo "🔗 Creando tunnel HTTPS..."
ngrok http 11434 --log stdout

echo
echo "✅ Usa la URL HTTPS que aparece arriba en Promptly"
echo "   Ejemplo: https://abc123.ngrok.io"