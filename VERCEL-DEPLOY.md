# Promptly - Vercel Deployment

Este proyecto también está disponible en Vercel con funcionalidad de proxy CORS:

## 🚀 Deploy a Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYamiCueto%2Fpromptiely)

## 🔧 Configuración

1. **Fork el repositorio**
2. **Conecta con Vercel** 
3. **Deploy automático** - El proxy CORS se configurará automáticamente
4. **Usa la URL de Vercel** para funcionalidad completa de proxy

## 📡 Endpoints disponibles

- **Sitio principal**: `https://tu-proyecto.vercel.app`
- **Proxy CORS**: `https://tu-proyecto.vercel.app/api/ollama-proxy`

## ⚙️ Variables de entorno (opcionales)

```env
ALLOWED_ORIGINS=https://yamicueto.github.io,https://tu-proyecto.vercel.app
OLLAMA_DEFAULT_HOST=http://localhost:11434
```

## 🔄 Funcionamiento

1. **GitHub Pages** - Sitio estático principal
2. **Vercel Functions** - Proxy CORS para Ollama
3. **Detección automática** - El sistema elige la mejor estrategia

---

**Instrucciones detalladas en [CORS-SYSTEM.md](CORS-SYSTEM.md)**