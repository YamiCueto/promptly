# Promptly 🤖

[![Deploy Status](https://github.com/YamiCueto/promptly/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/YamiCueto/promptly/actions)
[![CI Status](https://github.com/YamiCueto/promptly/workflows/CI/badge.svg)](https://github.com/YamiCueto/promptly/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/YamiCueto/promptly/releases)

Una interfaz de chat moderna y elegante que se conecta tanto a **Ollama local** como a **APIs externas** de proveedores de IA como OpenAI, Anthropic y Groq.

## ✨ Características

- 🏠 **Conexión a Ollama Local** - Ejecuta modelos de IA localmente
- ☁️ **APIs Externas** - Soporte para OpenAI, Anthropic (Claude), y Groq
- 🎨 **Interfaz Moderna** - Diseño inspirado en ChatGPT/Claude
- 📱 **Responsive** - Funciona perfectamente en dispositivos móviles
- 🚀 **Fácil Deploy** - Compatible con GitHub Pages
- ⚡ **Vanilla JavaScript** - Sin frameworks pesados, carga rápida
- 💾 **Historial Local** - Guarda tus conversaciones en el navegador
- 🌙 **Tema Oscuro** - Interfaz cómoda para los ojos
- 🎊 **Notificaciones Elegantes** - SweetAlert2 para mejor UX
- 📤 **Exportar Conversaciones** - Descarga en formato texto o Markdown

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

## ⚙️ Configuración

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

## 🔧 Características Técnicas

### Estructura del Proyecto
```
promptly/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos principales
├── js/
│   ├── config.js       # Configuración y utilidades
│   ├── providers.js    # Manejo de proveedores de IA
│   ├── chat.js         # Lógica del chat
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

1. **Configura tu proveedor**: Haz clic en el botón "⚙️ Configuración"
2. **Selecciona el proveedor** que prefieras (Ollama local o API externa)
3. **Configura los parámetros** (modelo, temperatura, tokens máximos)
4. **¡Comienza a chatear!** Escribe tu mensaje y presiona Enter

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
- 📊 Exportar conversaciones a diferentes formatos
- 🎨 Temas adicionales (claro, coloridos)
- 🔊 Síntesis de voz para las respuestas
- 📂 Organización de chats en carpetas
- 🔍 Búsqueda en el historial
- 🌐 Más proveedores de IA
- 📝 Plantillas de prompts predefinidos

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