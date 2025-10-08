# Promptly 🤖

[![Deploy Status](https://github.com/YamiCueto/promptly/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/YamiCueto/promptly/actions)
[![CI Status](https://github.com/YamiCueto/promptly/workflows/CI/badge.svg)](https://github.com/YamiCueto/promptly/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/YamiCueto/promptly/releases)

Una interfaz de chat moderna y elegante que se conecta tanto a **Ollama local** como a **APIs externas** de proveedores de IA como OpenAI, Anthropic y Groq.

## ✨ Características

- 🧙‍♂️ **Wizard de Configuración** - Setup guiado paso a paso para nuevos usuarios
- 🏠 **Conexión a Ollama Local** - Ejecuta modelos de IA localmente con detección automática
- 🔄 **Auto-detección de Modelos** - Carga automáticamente todos tus modelos de Ollama instalados
- 📜 **Auto-Scroll Inteligente** - Scroll automático suave durante las respuestas de IA
- ☁️ **APIs Externas** - Soporte para OpenAI, Anthropic (Claude), y Groq
- 🎨 **Interfaz Moderna** - Diseño inspirado en ChatGPT/Claude con Material Design
- 🌙 **Sistema de Temas** - Tema claro por defecto con opción de tema oscuro
- 📱 **Responsive** - Funciona perfectamente en dispositivos móviles
- 🚀 **Fácil Deploy** - Compatible con GitHub Pages
- ⚡ **Vanilla JavaScript** - Sin frameworks pesados, carga rápida
- 💾 **Historial Local** - Guarda tus conversaciones en el navegador
- 🎁 **Notificaciones Elegantes** - SweetAlert2 para mejor UX
- 📤 **Exportar Conversaciones** - Descarga en formato texto o Markdown
- 🎯 **Material Icons** - Iconos consistentes y modernos
- ⌨️ **Atajos de Teclado** - Navegación rápida y eficiente

## 🚀 Demo en Vivo

Visita: [https://yamicueto.github.io/promptly](https://yamicueto.github.io/promptly)

> **📋 IMPORTANTE**: Para configuración completa, troubleshooting y convenciones de desarrollo, consulta [INSTRUCTIONS.md](INSTRUCTIONS.md)

## 🛠️ Instalación Rápida

### Opción 1: Uso Directo (Recomendado)

1. Clona el repositorio:
```bash
git clone https://github.com/YamiCueto/promptly.git
cd promptly
```

2. Abre `index.html` en tu navegador o usa un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Con VS Code Live Server
# Instala la extensión Live Server y haz clic derecho en index.html
```

### Opción 2: Deploy en GitHub Pages

1. Fork este repositorio
2. Ve a Settings > Pages
3. Selecciona "Deploy from a branch" 
4. Elige la rama `main` y carpeta `/ (root)`
5. Tu sitio estará disponible en `https://tuusuario.github.io/promptly`

## 🧙‍♂️ Wizard de Configuración Inicial

**¡Nuevo en v1.1.0!** Promptly ahora incluye un **wizard de configuración guiado** que hace la instalación súper fácil para nuevos usuarios.

### ✨ ¿Qué hace el Wizard?

Cuando abres Promptly por primera vez, aparece automáticamente un wizard elegante que te guía paso a paso:

#### **Paso 1: Bienvenida** 🚀

- Introducción amigable a Promptly
- Resumen de características principales
- Explicación de los tipos de proveedores disponibles

#### **Paso 2: Selección de Proveedor** 🎯

- **Ollama Local** - Para ejecutar modelos en tu computadora
- **APIs Externas** - Para conectar con OpenAI, Anthropic, Groq

#### **Paso 3: Configuración Específica** ⚙️

**Para Ollama Local:**

- Test de conexión en tiempo real a `http://localhost:11434`
- Detección automática de modelos disponibles
- Ayuda contextual si hay problemas de conexión
- Validación de que Ollama esté ejecutándose

**Para APIs Externas:**

- Selección del proveedor (OpenAI, Anthropic, Groq)
- Entrada segura de API key con validación básica
- Configuración automática de modelos predeterminados

#### **Paso 4: Finalización** ✅

- Resumen de la configuración guardada
- Aplicación automática de settings
- Inicio inmediato de la aplicación

### 🎨 Características del Wizard

- **Interfaz moderna** con backdrop blur y animaciones suaves
- **Progreso visual** con barra de avance y contador de pasos
- **Validación en tiempo real** - los botones se habilitan automáticamente cuando la configuración es válida
- **Responsive** - funciona perfectamente en móviles y desktop
- **Skip automático** - solo aparece en la primera visita
- **Configuración instantánea** - al terminar, la app está lista para usar

### 🚀 Cómo Usar el Wizard

1. **Primera visita**: El wizard aparece automáticamente
2. **Reconfigurar**: Puedes reactivarlo borrando el localStorage:

   ```javascript
   localStorage.removeItem('promptly_setup_completed');
   location.reload();
   ```

3. **Configuración manual**: También puedes usar el panel de configuración tradicional (⚙️)

### 💡 Ventajas del Wizard

- **Para nuevos usuarios**: Configuración sin confusión en menos de 2 minutos
- **Para usuarios de Ollama**: Test automático de conexión y detección de modelos
- **Para usuarios de APIs**: Validación de keys y configuración automática
- **Para todos**: Experiencia más pulida y profesional

## ⚙️ Configuración Manual (Tradicional)

### Ollama Local

1. **Instala Ollama** en tu sistema:
   - **Windows/macOS/Linux**: Descarga desde [ollama.ai](https://ollama.ai)

2. **Descarga un modelo**:
```bash
ollama pull llama3.2
# o cualquier otro modelo que prefieras
```

3. **Inicia Ollama**:
```bash
ollama serve
```

4. En Promptly:
   - Selecciona "Ollama (Local)" como proveedor
   - Verifica que la URL sea `http://localhost:11434`
   - Haz clic en "Actualizar Modelos" para cargar los modelos disponibles
   - Selecciona tu modelo preferido

### APIs Externas

#### OpenAI
1. Obtén tu API key desde [platform.openai.com](https://platform.openai.com)
2. En Promptly, selecciona "OpenAI" como proveedor
3. Ingresa tu API key
4. Selecciona el modelo (gpt-4, gpt-3.5-turbo, etc.)

#### Anthropic (Claude)
1. Obtén tu API key desde [console.anthropic.com](https://console.anthropic.com)
2. Selecciona "Anthropic (Claude)" como proveedor
3. Ingresa tu API key
4. Selecciona el modelo (claude-3-opus, claude-3-sonnet, etc.)

#### Groq
1. Obtén tu API key desde [console.groq.com](https://console.groq.com)
2. Selecciona "Groq" como proveedor
3. Ingresa tu API key
4. Selecciona el modelo (llama3-70b-8192, mixtral-8x7b-32768, etc.)

## 🎯 Características Destacadas

### 🔄 Auto-detección de Modelos Ollama
- **Carga automática** de todos los modelos instalados en tu Ollama local
- **Detección en tiempo real** - no necesitas configurar manualmente la lista
- **Soporte completo** para cualquier modelo: `llama3.2`, `gpt-oss`, `qwen2.5-coder`, etc.
- **Actualización dinámica** - los modelos aparecen automáticamente al instalarlos

### 📜 Auto-Scroll Inteligente
- **Scroll automático suave** durante las respuestas de la IA
- **Seguimiento en tiempo real** del progreso de la respuesta
- **Scroll continuo** cada 100ms mientras la IA está escribiendo
- **Detención automática** cuando termina la respuesta
- **Optimizado para móviles** y desktop

### 🎨 Sistema de Temas Mejorado
- **Tema claro por defecto** para mejor legibilidad
- **Alternancia suave** entre tema claro y oscuro
- **Persistencia** - recuerda tu preferencia de tema
- **Material Design** con iconos consistentes
- **Variables CSS** para fácil personalización

### 🚀 Rendimiento Optimizado
- **Vanilla JavaScript** - sin dependencias pesadas
- **Carga rápida** - menos de 1 segundo de tiempo inicial
- **Material Icons** desde CDN optimizado
- **SweetAlert2** para notificaciones elegantes

## 🔧 Características Técnicas

### Estructura del Proyecto

```
promptly/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos principales
├── js/
│   ├── config.js       # Configuración y utilidades
│   ├── utils.js        # Funciones de utilidad
│   ├── providers.js    # Manejo de proveedores de IA
│   ├── chat.js         # Lógica del chat
│   ├── wizard.js       # Wizard de configuración inicial
│   └── app.js          # Aplicación principal
└── README.md
```

### Tecnologías Utilizadas
- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con variables CSS y Flexbox
- **Vanilla JavaScript** - Sin dependencias externas
- **LocalStorage** - Persistencia de configuración y chat
- **Fetch API** - Comunicación con APIs

### Características de Seguridad
- Las API keys se almacenan localmente en tu navegador
- No se envían datos a terceros (excepto a los proveedores de IA que configures)
- Comunicación HTTPS con todos los proveedores externos

## 📱 Uso

### 🧙‍♂️ Primera Vez (Con Wizard)

**¡Súper fácil!** Si es tu primera vez usando Promptly:

1. **Abre la aplicación** - El wizard aparece automáticamente
2. **Sigue los 4 pasos** del wizard guiado:
   - Bienvenida y selección de proveedor
   - Configuración específica con validación en tiempo real
   - Resumen y confirmación
3. **¡Listo!** - La app se configura automáticamente y está lista para usar

### ⚙️ Uso Manual (Configuración Tradicional)

1. **Configura tu proveedor**: Haz clic en el botón "⚙️ Configuración"
2. **Selecciona el proveedor** que prefieras (Ollama local o API externa)
3. **Los modelos se cargan automáticamente** - para Ollama, verás todos tus modelos instalados
4. **Selecciona tu modelo** desde el selector en el header (actualizado en tiempo real)
5. **Configura los parámetros** (temperatura, tokens máximos)
6. **¡Comienza a chatear!** Escribe tu mensaje y presiona Enter
7. **Disfruta del auto-scroll** - el chat se desplaza automáticamente mientras la IA responde

### 🎯 Funcionalidades Especiales

- **Cambio rápido de modelo**: Usa el selector del header para cambiar modelos sin abrir configuración
- **Auto-scroll inteligente**: El chat se mantiene automáticamente en la última respuesta
- **Tema personalizable**: Alternar entre tema claro y oscuro con un clic
- **Exportación flexible**: Descarga conversaciones en formato texto o Markdown
- **Notificaciones elegantes**: Feedback visual para todas las acciones

### Atajos de Teclado
- `Ctrl/Cmd + ,` - Abrir configuración
- `Ctrl/Cmd + K` - Limpiar chat
- `Enter` - Enviar mensaje
- `Shift + Enter` - Nueva línea
- `Esc` - Cerrar configuración

## 🤝 Contribuir

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