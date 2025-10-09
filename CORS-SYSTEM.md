# 🔧 Sistema de Manejo CORS Inteligente

## 📖 Resumen

Este sistema resuelve automáticamente los problemas de CORS cuando usas Promptly desde GitHub Pages para conectarte a Ollama local. En lugar de requerir configuración manual, detecta la mejor estrategia disponible.

## 🎯 Soluciones Implementadas

### 1. **Detección Automática de CORS**
```javascript
const corsHandler = new CORSHandler();
await corsHandler.findWorkingStrategy();
```

**Estrategias disponibles:**
- ✅ **Conexión Directa** - Si CORS ya está configurado
- 🔄 **Proxy Backend** - Usa servidor intermedio en Vercel
- 🌐 **Tunnel Público** - Detecta ngrok/cloudflare tunnels
- 🔌 **APIs Externas** - Fallback a OpenAI/Anthropic

### 2. **Wizard de Configuración**
```javascript
const wizard = new CORSWizard();
await wizard.start();
```

**Características:**
- 🔍 **Diagnóstico automático** de problemas CORS
- 📋 **Instrucciones paso a paso** para cada OS
- 💾 **Scripts automáticos** para Windows/Mac/Linux
- ✅ **Verificación en tiempo real**

### 3. **Proxy Backend (Vercel)**
```javascript
// api/ollama-proxy.js
export default async function handler(request) {
  // Proxy seguro a Ollama local
}
```

**Ventajas:**
- 🛡️ **Seguro** - Solo permite dominios autorizados
- ⚡ **Rápido** - Edge functions de Vercel
- 🌍 **Global** - Funciona desde cualquier ubicación

## 🚀 Configuración Rápida

### Para Usuarios Finales

1. **Abre Promptly** en GitHub Pages
2. **Configura Ollama** - El wizard aparece automáticamente
3. **Sigue las instrucciones** específicas para tu OS
4. **¡Listo!** - Promptly se conecta automáticamente

### Para Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local (sin CORS issues)
npm run dev

# Deploy a Vercel (con proxy)
vercel deploy

# Build CSS
npm run build:css
```

## 🔧 Configuración Manual de CORS

### Windows
```cmd
# Cerrar Ollama
taskkill /F /IM ollama.exe

# Configurar variables
setx OLLAMA_ORIGINS "*"
setx OLLAMA_HOST "0.0.0.0:11434"

# Reiniciar sistema
# Luego: ollama serve
```

### macOS/Linux
```bash
# Editar perfil
echo 'export OLLAMA_ORIGINS="*"' >> ~/.bashrc
echo 'export OLLAMA_HOST="0.0.0.0:11434"' >> ~/.bashrc

# Recargar
source ~/.bashrc

# Reiniciar Ollama
ollama serve
```

## 📚 API Reference

### CORSHandler Class

```javascript
const handler = new CORSHandler();

// Detectar estrategia funcional
await handler.findWorkingStrategy(testUrl);

// Hacer petición con la mejor estrategia
const response = await handler.makeRequest(url, options);
```

### CORSWizard Class

```javascript
const wizard = new CORSWizard();

// Iniciar wizard completo
await wizard.start();

// Probar configuración
await wizard.rerunTest();
```

## 🏗️ Arquitectura

```
GitHub Pages (HTTPS)
         ↓
    CORS Handler
    ┌─────────────┐
    │ Strategy 1  │ → Direct Connection
    │ Strategy 2  │ → Vercel Proxy  
    │ Strategy 3  │ → Tunnel Detection
    │ Strategy 4  │ → External APIs
    └─────────────┘
         ↓
    Ollama Local (HTTP)
```

## 🐛 Troubleshooting

### Error: "No working strategy found"
1. Verifica que Ollama esté ejecutándose
2. Ejecuta el wizard de configuración
3. Revisa la configuración de CORS
4. Intenta usar el proxy de Vercel

### Error: "Proxy not available"
1. Deploy el proyecto a Vercel
2. Configura las variables de entorno
3. Verifica que `/api/ollama-proxy` responda

### Error: "Tunnel detection failed"
1. Instala ngrok: `npm install -g ngrok`
2. Expón Ollama: `ngrok http 11434`
3. El sistema detectará automáticamente el tunnel

## 📝 Próximas Mejoras

- [ ] **Caché de estrategias** - Recordar estrategia funcional
- [ ] **Múltiples endpoints** - Soportar varios servidores Ollama
- [ ] **Métricas de rendimiento** - Velocidad de cada estrategia
- [ ] **Configuración avanzada** - Headers personalizados
- [ ] **Modo offline** - Funcionalidad sin conexión

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una branch: `git checkout -b feature/cors-improvement`
3. Commit cambios: `git commit -m 'Add CORS feature'`
4. Push: `git push origin feature/cors-improvement`
5. Abre un Pull Request

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles.

---

**💡 Tip:** Para la mejor experiencia, usa el comando `npm run dev` durante desarrollo local, que incluye configuración CORS automática.