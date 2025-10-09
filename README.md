# Promptly 🚀

[![Deploy Status](https://github.com/YamiCueto/promptly/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/YamiCueto/promptly/actions)
[![CI Status](https://github.com/YamiCueto/promptly/workflows/CI/badge.svg)](https://github.com/YamiCueto/promptly/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/YamiCueto/promptly/releases)

Una interfaz de chat moderna y elegante que se conecta tanto a **Ollama local** como a **APIs externas** de proveedores de IA. Completamente rediseñada con arquitectura modular, sistema CORS inteligente y experiencia de usuario mejorada.

## ✨ Características Principales

### 🧙‍♂️ **Sistema de Configuración Inteligente**
- **Wizard paso a paso** - Configuración guiada para nuevos usuarios
- **Detección automática** - Encuentra Ollama y modelos disponibles
- **CORS inteligente** - Soluciona problemas de conectividad automáticamente
- **4 estrategias de conexión** - Conexión directa, proxy, tunnel, APIs externas

### 🏠 **Ollama Local + APIs Externas**
- **Auto-detección de modelos** - Carga todos tus modelos instalados
- **Conexión sin configuración** - Funciona out-of-the-box con Ollama
- **Múltiples proveedores** - OpenAI, Anthropic (Claude), Groq
- **Fallback automático** - Si falla local, usa APIs externas

### 🎨 **Interfaz Moderna y Responsive**
- **Diseño Material** - Inspirado en ChatGPT/Claude
- **Sistema de temas** - Claro/oscuro con transiciones suaves
- **Responsive design** - Funciona en móviles, tablets y desktop
- **Animaciones fluidas** - Auto-scroll inteligente y transiciones

### ⚡ **Arquitectura Optimizada**
- **CSS modular** - 8 componentes organizados para desarrollo
- **Build system** - Combina módulos en archivo único para producción
- **Vanilla JS** - Sin frameworks, carga ultra-rápida
- **GitHub Pages ready** - Deploy automático sin configuración

## � Demo en Vivo

**Sitio Principal**: [https://yamicueto.github.io/promptly](https://yamicueto.github.io/promptly)

**Con Proxy CORS**: [Deploy a Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYamiCueto%2Fpromptly) para funcionalidad completa de proxy

## 📁 Estructura del Proyecto

```
promptly/
├── 📄 index.html                 # Página principal
├── � css/
│   ├── 📁 components/            # Módulos CSS organizados
│   │   ├── variables.css         # Temas y variables CSS
│   │   ├── base.css             # Reset y estilos base
│   │   ├── layout.css           # Grid y layout principal
│   │   ├── header.css           # Header y navegación
│   │   ├── buttons.css          # Botones y controles
│   │   ├── forms.css           # Formularios e inputs
│   │   ├── wizard.css          # Wizard de configuración
│   │   └── chat.css            # Chat y mensajes
│   ├── styles.css              # CSS original (backup)
│   ├── styles-combined.css     # CSS compilado (desarrollo)
│   └── styles-combined.min.css # CSS minificado (producción)
├── 🧩 js/
│   ├── config.js               # Configuración global
│   ├── utils.js                # Utilidades generales
│   ├── cors-handler.js         # Sistema CORS inteligente
│   ├── cors-wizard.js          # Wizard de configuración CORS
│   ├── providers.js            # Proveedores de IA
│   ├── chat.js                 # Lógica del chat
│   ├── wizard.js              # Wizard de configuración
│   └── app.js                 # Aplicación principal
├── 🛠️ api/
│   └── ollama-proxy.js         # Proxy CORS para Vercel
├── 🔧 Build System
│   ├── build-css.js            # Script Node.js (recomendado)
│   ├── build-css.sh            # Script Bash (Linux/macOS)
│   ├── build-css.bat           # Script Windows Batch
│   ├── package.json            # Dependencias y scripts npm
│   └── vercel.json            # Configuración Vercel
├── 📚 Documentación
│   ├── README.md              # Este archivo
│   ├── CORS-GUIDE.md          # Guía detallada de CORS
│   ├── CORS-SYSTEM.md         # Documentación del sistema CORS
│   ├── VERCEL-DEPLOY.md       # Guía de deployment en Vercel
│   └── INSTRUCTIONS.md        # Instrucciones técnicas detalladas
└── 🎯 .vscode/
    └── tasks.json             # Tareas de VS Code
```

## 🛠️ Instalación y Desarrollo

### Opción 1: Uso Directo (Más Simple)

```bash
# Clonar repositorio
git clone https://github.com/YamiCueto/promptly.git
cd promptly

# Abrir en navegador
open index.html

# O usar servidor local
python -m http.server 8000
# Visitar: http://localhost:8000
```

### Opción 2: Desarrollo con Build System

```bash
# Clonar e instalar dependencias
git clone https://github.com/YamiCueto/promptly.git
cd promptly
npm install

# Desarrollo (con CORS automático)
npm run dev

# Build CSS (combina módulos)
npm run build:css

# Build completo (CSS + validación)
npm run build
```

## 🚀 Deployments y Opciones

### Opción 3: Deploy en Vercel (Con Proxy CORS)

Para funcionalidad completa incluyendo proxy CORS automático:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYamiCueto%2Fpromptly)

```bash
# O manualmente
git clone https://github.com/YamiCueto/promptly.git
cd promptly
vercel deploy
```

### Opción 4: Fork y GitHub Pages

```bash
# 1. Fork el repositorio en GitHub
# 2. Clone tu fork
git clone https://github.com/TU-USUARIO/promptly.git
cd promptly

# 3. Habilita GitHub Pages
# Settings > Pages > Deploy from branch > main
```

## 🔧 Sistema CORS Inteligente

### ¿Qué es y por qué lo necesitas?

Cuando usas Promptly desde **GitHub Pages** (HTTPS) e intentas conectar con **Ollama local** (HTTP), los navegadores bloquean la conexión por seguridad. Nuestro sistema CORS resuelve esto automáticamente.

### 🎯 4 Estrategias Automáticas

1. **🔗 Conexión Directa** - Si ya tienes CORS configurado
2. **🔄 Proxy Vercel** - Servidor intermedio que evita CORS
3. **🌐 Tunnel Detection** - Detecta ngrok/cloudflare automáticamente
4. **☁️ APIs Externas** - Fallback a OpenAI/Anthropic

### 🧙‍♂️ Wizard CORS Automático

Si hay problemas de CORS, aparece automáticamente un wizard que:

- 🔍 **Diagnostica** el problema específico
- 📋 **Genera instrucciones** para tu sistema operativo
- 💾 **Descarga scripts** de configuración automática
- ✅ **Verifica** que la solución funcione

### 🛠️ Configuración Manual CORS (Si Necesaria)

#### Windows
```cmd
# Cerrar Ollama
taskkill /F /IM ollama.exe

# Configurar variables
setx OLLAMA_ORIGINS "*"
setx OLLAMA_HOST "0.0.0.0:11434"

# Reiniciar sistema y ejecutar
ollama serve
```

#### macOS/Linux
```bash
# Agregar al perfil
echo 'export OLLAMA_ORIGINS="*"' >> ~/.bashrc
echo 'export OLLAMA_HOST="0.0.0.0:11434"' >> ~/.bashrc

# Recargar y reiniciar Ollama
source ~/.bashrc
ollama serve
```

## 🏗️ Build System Modular

### Scripts Disponibles

```bash
# Desarrollo con recarga automática
npm run dev

# Compilar CSS desde módulos
npm run build:css

# Build completo con validación
npm run build

# Validar estructura del proyecto
npm run validate
```

### 🧩 Arquitectura CSS Modular

El sistema de CSS está diseñado para **desarrollo modular** con **producción optimizada**:

**Desarrollo**: Edita módulos independientes en `css/components/`
**Producción**: Build automático combina todo en `styles-combined.min.css`

#### Módulos CSS Disponibles

1. **`variables.css`** - Temas y variables CSS (claro/oscuro)
2. **`base.css`** - Reset CSS y estilos base
3. **`layout.css`** - Grid, flexbox y layout principal
4. **`header.css`** - Header, navegación y selector de modelos
5. **`buttons.css`** - Botones, iconos y controles
6. **`forms.css`** - Formularios, inputs y wizard CORS
7. **`wizard.css`** - Wizard de configuración inicial
8. **`chat.css`** - Chat, mensajes y conversaciones

#### Build Process

```bash
# CSS Modular (desarrollo)
css/components/*.css → npm run build:css → styles-combined.min.css

# Ventajas
- ✅ Desarrollo organizado por componentes
- ✅ Producción con archivo único optimizado  
- ✅ GitHub Pages compatible (sin @import)
- ✅ 25% reducción de tamaño con minificación
```

## 🎯 Funcionalidades Principales

### 🧙‍♂️ Wizard de Configuración

**Auto-aparece en primera visita** con setup guiado:

1. **Bienvenida** - Intro a funcionalidades
2. **Selección de Proveedor** - Ollama vs APIs externas  
3. **Configuración** - Test en tiempo real + validación
4. **Finalización** - App lista para usar

```javascript
// Reactivar wizard manualmente
localStorage.removeItem('promptly_setup_completed');
location.reload();
```

### 🔄 Auto-detección de Modelos

**Para Ollama**: Detecta automáticamente todos los modelos instalados
**Para APIs**: Configura modelos predeterminados del proveedor

```bash
# Instalar modelo en Ollama  
ollama pull llama3.1
# → Aparece automáticamente en Promptly
```

### 🎨 Sistema de Temas Avanzado

- **Tema claro/oscuro** con transiciones suaves
- **Auto-detección** del tema del sistema
- **Persistencia** en localStorage
- **Variables CSS** para personalización

### ⚡ Optimizaciones de Rendimiento

- **Vanilla JS** - Sin frameworks pesados
- **CSS minificado** - 25% reducción de tamaño
- **Lazy loading** - Carga inteligente de componentes
- **Cache optimizado** - Assets con versioning

## 🛠️ Configuración de Proveedores

### 🏠 Ollama Local

```bash
# 1. Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Descargar modelo
ollama pull llama3.1

# 3. Iniciar servidor  
ollama serve

# 4. En Promptly: ¡Detección automática!
```

### ☁️ APIs Externas

#### OpenAI
```bash
# 1. Obtener API key: https://platform.openai.com
# 2. En Promptly: Configuración > OpenAI > Pegar key
```

#### Anthropic (Claude)
```bash
# 1. Obtener API key: https://console.anthropic.com  
# 2. En Promptly: Configuración > Anthropic > Pegar key
```

#### Groq
```bash
# 1. Obtener API key: https://console.groq.com
# 2. En Promptly: Configuración > Groq > Pegar key
```

## 📚 Documentación Adicional

- **[CORS-GUIDE.md](CORS-GUIDE.md)** - Guía detallada de problemas CORS
- **[CORS-SYSTEM.md](CORS-SYSTEM.md)** - Documentación técnica del sistema CORS
- **[VERCEL-DEPLOY.md](VERCEL-DEPLOY.md)** - Deploy con proxy en Vercel
- **[INSTRUCTIONS.md](INSTRUCTIONS.md)** - Instrucciones técnicas avanzadas

## 🧪 Desarrollo y Contribución

### Setup de Desarrollo

```bash
# Clonar repo
git clone https://github.com/YamiCueto/promptly.git
cd promptly

# Instalar dependencias
npm install

# Modo desarrollo  
npm run dev

# Build CSS modular
npm run build:css

# Validar todo
npm run validate
```

### 🏗️ Estructura de Desarrollo

```bash
# Editar estilos
css/components/       # Editar módulos individuales
npm run build:css     # Compilar a producción

# Editar JavaScript  
js/                   # Módulos organizados por función
# No requiere build - vanilla JS

# Editar documentación
*.md                  # Markdown con linting automático
```

### 🚀 Deploy Process

```bash
# 1. Hacer cambios
git add .
git commit -m "✨ Nueva funcionalidad"

# 2. Build CSS si necesario
npm run build:css

# 3. Push a GitHub
git push origin main

# 4. GitHub Pages auto-deploy ✅
```

## 🎯 Características Avanzadas

### 🔥 Auto-Scroll Inteligente
- **Scroll automático** durante respuestas de IA
- **Detección de velocidad** adaptativa según el contenido
- **Interrupción manual** - scroll manual pausa el auto-scroll
- **Optimizado móvil** - funciona perfectamente en touch

### 🎨 Sistema de Temas Dinámico
- **Auto-detección** del tema del sistema
- **Transiciones suaves** entre claro y oscuro
- **Persistencia inteligente** - recuerda tu preferencia
- **Variables CSS** - fácil personalización de colores

### 📱 Experiencia Móvil Optimizada
- **Touch-friendly** - botones y controles optimizados
- **Viewport adaptativo** - se ajusta a cualquier pantalla
- **Teclado inteligente** - manejo automático del foco
- **Gestos naturales** - swipe y pinch zoom donde aplique

### ⚡ Performance Extrema
- **<1s tiempo de carga** inicial
- **Lazy loading** de componentes no críticos
- **Cache inteligente** de configuraciones
- **Debounce automático** en inputs para evitar spam

## 🛠️ Atajos y Tips

### ⌨️ Atajos de Teclado
```
Ctrl/Cmd + ,     → Abrir configuración
Ctrl/Cmd + K     → Limpiar chat  
Enter            → Enviar mensaje
Shift + Enter    → Nueva línea
Esc              → Cerrar modales
```

### 💡 Tips de Uso
- **Cambio rápido de modelo**: Usa el selector del header
- **Exportar conversaciones**: Botón "📤 Exportar" en configuración
- **Reconfigurar wizard**: `localStorage.clear()` en consola
- **Debug CORS**: Consulta la pestaña Network en DevTools
- **Personalizar CSS**: Modifica variables en `css/components/variables.css`

## 🔄 CI/CD y Deployment

### GitHub Actions Workflows

Este proyecto utiliza GitHub Actions para automatización:

#### 📦 Deploy Workflow (`deploy.yml`)
- **Trigger**: Push a `main` branch
- **Acciones**:
  - ✅ Instala dependencias Node.js
  - 🔨 Compila CSS desde módulos (`npm run build:css`)
  - 📊 Genera estadísticas de build
  - 🚀 Despliega a GitHub Pages
  - 🔍 Valida deployment

#### 🎨 CSS Build Workflow (`build-css.yml`)
- **Trigger**: 
  - Push a `main`/`develop` 
  - PRs a `main`
  - Cambios en `css/components/**`
  - Manual (`workflow_dispatch`)
- **Acciones**:
  - 🔨 Compila CSS modular
  - 📊 Calcula estadísticas de compresión
  - ✅ Valida build
  - 💾 Auto-commit de CSS compilado
  - 📁 Guarda artifacts

### 🚀 Deployment Automático

```bash
# El deployment es automático al hacer push a main:
git push origin main

# Los estilos se compilan automáticamente:
# css/components/*.css → css/styles-combined.css
```

### 📊 Build Statistics
El sistema de build genera estadísticas automáticas:
- **Tamaño original vs comprimido**
- **Porcentaje de reducción** 
- **Número de módulos procesados**
- **Tiempo de compilación**

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este proyecto es open-source y está en constante mejora.

### 🚀 Setup de Contribución

```bash
# 1. Fork el repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU-USUARIO/promptly.git
cd promptly

# 3. Crear branch para tu feature
git checkout -b feature/mi-nueva-funcionalidad

# 4. Instalar dependencias
npm install

# 5. Desarrollo
npm run dev  # Servidor con hot reload
npm run build:css  # Build CSS si modificas estilos

# 6. Commit y push
git add .
git commit -m "✨ Agregar nueva funcionalidad"
git push origin feature/mi-nueva-funcionalidad

# 7. Crear Pull Request en GitHub
```

### 🧪 Testing CI/CD Localmente

```bash
# Probar build de CSS
npm run build:css
npm run validate

# Verificar que los estilos se generaron
ls -la css/styles-combined.*

# Probar servidor local
npm run dev
```

### 📋 Guidelines

- **CSS**: Editar módulos en `css/components/`, no el archivo compilado
- **JS**: Mantener módulos separados por funcionalidad
- **Commits**: Usar emojis convencionales (✨ feature, 🐛 bugfix, 📚 docs)
- **Testing**: Probar en Chrome, Firefox y Safari
- **Mobile**: Verificar responsive en dispositivos reales

### 🎯 Áreas que Necesitan Ayuda

- **🌐 i18n**: Internacionalización y múltiples idiomas
- **🎨 Temas**: Más temas y personalizaciones
- **🔌 Plugins**: Sistema de plugins para extensibilidad
- **📊 Analytics**: Dashboard de uso (privacy-first)
- **🔊 Accessibility**: Mejoras de accesibilidad
- **🧪 Testing**: Unit tests y testing automatizado

## 📊 Estadísticas del Proyecto

- **📏 Tamaño total**: ~150KB (incluye todas las dependencias)
- **⚡ Tiempo de carga**: <1 segundo en conexión promedio
- **🎨 CSS modular**: 8 componentes organizados
- **🧩 JS modular**: 7 módulos especializados
- **📱 Compatibilidad**: Chrome 80+, Firefox 75+, Safari 13+
- **🌍 Deployment**: GitHub Pages + Vercel ready

## 🔗 Enlaces Útiles

### 📚 Documentación
- **[CORS-GUIDE.md](CORS-GUIDE.md)** - Solucionar problemas de CORS
- **[CORS-SYSTEM.md](CORS-SYSTEM.md)** - Documentación técnica CORS
- **[VERCEL-DEPLOY.md](VERCEL-DEPLOY.md)** - Deploy con proxy en Vercel
- **[INSTRUCTIONS.md](INSTRUCTIONS.md)** - Instrucciones técnicas avanzadas

### 🌐 Demos y Deploy
- **Demo Principal**: [yamicueto.github.io/promptly](https://yamicueto.github.io/promptly)
- **Deploy Vercel**: [Botón de deploy](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYamiCueto%2Fpromptly)
- **Repositorio**: [github.com/YamiCueto/promptly](https://github.com/YamiCueto/promptly)

### 🔧 APIs y Herramientas
- **Ollama**: [ollama.ai](https://ollama.ai) - IA local
- **OpenAI**: [platform.openai.com](https://platform.openai.com) - API keys
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com) - Claude API
- **Groq**: [console.groq.com](https://console.groq.com) - API rápida

## 📝 Changelog

### v2.0.0 (2025-10-09) 🎉
- ✨ **Sistema CORS inteligente** con 4 estrategias automáticas
- 🧩 **CSS modular** con build system optimizado
- 🧙‍♂️ **Wizard CORS** para configuración automática
- 📱 **Proxy Vercel** para GitHub Pages
- ⚡ **25% reducción** de tamaño con minificación
- 🛠️ **Build system** con scripts multiplataforma
- 📚 **Documentación expandida** con guías detalladas

### v1.1.0 (2025-10-08)
- 🧙‍♂️ **Wizard de configuración** inicial
- 🔄 **Auto-detección** de modelos Ollama
- 📜 **Auto-scroll inteligente** en chat
- 🎨 **Sistema de temas** mejorado

### v1.0.0 (2025-10-07)
- 🚀 **Lanzamiento inicial**
- 🏠 **Soporte Ollama local**
- ☁️ **APIs externas** (OpenAI, Anthropic, Groq)
- 🎨 **Interfaz moderna** Material Design

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

**💡 Tip final**: Para la mejor experiencia, usa `npm run dev` durante desarrollo local para evitar problemas de CORS, y despliega en Vercel para funcionalidad completa de proxy en producción.

**Hecho con ❤️ por la comunidad open-source**

¡Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas para Contribuir
- 🎨 Temas adicionales (coloridos, personalizados)
- 🔊 Síntesis de voz para las respuestas
- 📂 Organización de chats en carpetas
- 🔍 Búsqueda en el historial
- 🌐 Más proveedores de IA (Cohere, Together AI)
- 📝 Plantillas de prompts predefinidos
- ⚡ Streaming en tiempo real para APIs externas
- 🔗 Compartir conversaciones públicamente
- 📊 Estadísticas de uso y métricas
- 🔌 Sistema de plugins extensible

### ✅ Ya Implementado
- ✅ **Auto-scroll inteligente** durante respuestas
- ✅ **Auto-detección de modelos Ollama** 
- ✅ **Sistema de temas** claro/oscuro
- ✅ **Exportar conversaciones** en texto y Markdown
- ✅ **Notificaciones elegantes** con SweetAlert2
- ✅ **Material Design** con iconos consistentes
- ✅ **Interfaz responsive** optimizada para móviles

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ve el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [Ollama](https://ollama.ai) por hacer la IA local tan accesible
- [OpenAI](https://openai.com) por sus potentes APIs
- [Anthropic](https://anthropic.com) por Claude
- [Groq](https://groq.com) por su inferencia ultra-rápida
- La comunidad de desarrolladores por la inspiración constante

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa las [Issues](https://github.com/YamiCueto/promptly/issues) existentes
2. Crea una nueva Issue si no encuentras solución
3. Para problemas de Ollama, consulta su [documentación oficial](https://github.com/jmorganca/ollama)

---

**¿Te gusta Promptly?** ⭐ ¡Dale una estrella al repositorio!

Hecho con ❤️ por [YamiCueto](https://github.com/YamiCueto)