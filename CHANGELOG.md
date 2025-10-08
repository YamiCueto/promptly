# Promptly - Changelog

## [1.1.0] - 2024-10-08

### 🎊 Nuevas Características

#### Notificaciones Elegantes
- ✨ **SweetAlert2 Integration** - Reemplazadas notificaciones básicas con SweetAlert2
- 🎨 **Tema Oscuro Personalizado** - Notificaciones que se integran perfectamente con el diseño
- 🔔 **Notificaciones Contextuales** - Success, error, warning e info con iconos apropiados
- ⏱️ **Auto-dismiss con Pausa** - Se pausan al hacer hover, se reanudan al salir

#### Exportación de Conversaciones
- 📤 **Botón de Exportar** - Nuevo botón en el header para exportar conversaciones
- 📄 **Formato Texto** - Exportación en formato .txt con timestamps
- 📋 **Formato Markdown** - Exportación en .md con formato estructurado
- 🎯 **Diálogo de Selección** - SweetAlert2 para elegir formato de exportación

#### Mejoras de UX
- ❓ **Confirmación Elegante** - SweetAlert2 para confirmación de limpiar chat
- ⚠️ **Validaciones Mejoradas** - Notificaciones claras para errores de configuración
- 🔄 **Feedback de Conexión** - Notificaciones para actualizaciones de modelos Ollama
- 📱 **Responsive Design** - Botones del header optimizados para móviles

### 🛠️ Mejoras Técnicas

#### GitHub Actions
- 🔧 **Workflows Corregidos** - Arreglados errores de npm ci y sintaxis YAML
- 📦 **package-lock.json** - Agregado para caching correcto de dependencias
- ✅ **CI Simplificado** - Tests más robustos y compatibles con CI/CD
- 🚀 **Deploy Estable** - Proceso de despliegue más confiable

#### Código y Estructura
- 🧹 **Código Limpio** - Funciones de notificación centralizadas
- 📝 **Documentación Actualizada** - INSTRUCTIONS.md con troubleshooting mejorado
- 🎨 **CSS Organizado** - Estilos de SweetAlert2 integrados con variables CSS
- 🔗 **CDN Integration** - SweetAlert2 cargado desde jsdelivr CDN

### 🔧 Dependencias

#### Nuevas Dependencias CDN
- **SweetAlert2** `v11` - Para notificaciones elegantes
- **jsdelivr CDN** - Para carga rápida y confiable

### 📋 Detalles de Implementación

#### SweetAlert2 Features
- 🎨 **Tema Oscuro Personalizado** - Colores integrados con variables CSS del proyecto
- 🔄 **Toast Notifications** - Posicionadas en top-end con auto-dismiss
- ❓ **Modales de Confirmación** - Para acciones destructivas como limpiar chat
- 📤 **Modales de Selección** - Para elegir formato de exportación

#### Export Features
- 📄 **Texto Plano**: Formato simple con timestamps en español
- 📋 **Markdown**: Formato estructurado con headers, timestamps y emojis
- 💾 **Download Automático**: Usando Blob API para descarga directa
- 🏷️ **Nombres Únicos**: Archivos con timestamp para evitar conflictos

### 🚨 Breaking Changes
- ❌ **Función `alert()` Removida** - Reemplazada por SweetAlert2
- ❌ **Función `confirm()` Removida** - Reemplazada por SweetAlert2
- ✅ **API Backward Compatible** - Métodos públicos mantienen compatibilidad

### 🔄 Migration Guide

Para proyectos que extienden Promptly:
```javascript
// Antes
alert('Mensaje');
confirm('¿Continuar?');

// Ahora
window.appManager.showNotification('Mensaje', 'info');
Swal.fire({
    title: '¿Continuar?',
    showCancelButton: true
}).then((result) => {
    if (result.isConfirmed) {
        // Acción confirmada
    }
});
```

---

## [1.0.0] - 2024-10-08

### ✨ Características Iniciales

#### Conectividad
- 🏠 **Soporte para Ollama Local** - Conexión completa a instancias locales de Ollama
- ☁️ **APIs Externas** - Integración con OpenAI, Anthropic (Claude), y Groq
- 🔄 **Auto-detección de modelos** - Carga automática de modelos disponibles en Ollama
- 🌐 **Verificación de conexión** - Estado en tiempo real de la conectividad

#### Interfaz de Usuario
- 🎨 **Diseño moderno** - Interfaz inspirada en ChatGPT/Claude con tema oscuro
- 📱 **Completamente responsive** - Optimizado para móviles, tablets y desktop
- ⚙️ **Panel de configuración** - Configuración intuitiva y completa
- 💬 **Chat fluido** - Experiencia de chat natural con burbujas de mensajes
- 🎯 **Indicadores de estado** - Estados visuales de conexión y envío

#### Funcionalidades del Chat
- 📝 **Markdown básico** - Soporte para negrita, cursiva y código
- 💾 **Historial persistente** - Guarda conversaciones en localStorage
- 🗑️ **Limpieza de chat** - Función para limpiar toda la conversación
- ⏳ **Estados de carga** - Indicadores visuales durante el procesamiento
- 📊 **Metadatos de mensajes** - Muestra modelo usado, tokens y timestamps

#### Configuración Avanzada
- 🌡️ **Control de temperatura** - Slider para ajustar creatividad de respuestas
- 🔢 **Tokens máximos** - Control sobre la longitud de respuestas
- 🔑 **Gestión segura de API keys** - Almacenamiento local seguro
- 🔄 **Cambio dinámico de proveedores** - Switch entre proveedores sin recargar

#### Experiencia de Usuario
- ⌨️ **Atajos de teclado** - Ctrl+, para configuración, Ctrl+K para limpiar
- 🔔 **Notificaciones** - Feedback visual para acciones del usuario
- 📏 **Auto-resize del input** - Textarea que se expande automáticamente
- 🎯 **Auto-scroll** - Scroll automático a nuevos mensajes
- 📤 **Envío inteligente** - Enter para enviar, Shift+Enter para nueva línea

#### Características Técnicas
- ⚡ **Vanilla JavaScript** - Sin frameworks, carga ultra-rápida
- 🏗️ **Arquitectura modular** - Código organizado en módulos especializados
- 💾 **Gestión de estado** - Manejo robusto del estado de la aplicación
- 🛡️ **Manejo de errores** - Gestión completa de errores y edge cases
- 🌐 **Compatible con GitHub Pages** - Deploy directo sin configuración

#### Proveedores Soportados

**Ollama (Local)**
- ✅ Conexión automática a localhost:11434
- ✅ Detección automática de modelos instalados
- ✅ Soporte para llama3.2, llama3.1, mistral, codellama, phi3
- ✅ Verificación de estado en tiempo real

**OpenAI**
- ✅ GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- ✅ Control completo de parámetros
- ✅ Manejo de tokens y costos

**Anthropic (Claude)**
- ✅ Claude-3 Opus, Sonnet, Haiku
- ✅ Claude Instant
- ✅ Integración completa con API v1

**Groq**
- ✅ Llama3-70B, Llama3-8B
- ✅ Mixtral-8x7B
- ✅ Gemma-7B
- ✅ Inferencia ultra-rápida

### 🔧 Aspectos Técnicos

#### Rendimiento
- ⚡ Carga inicial < 1 segundo
- 🎯 Zero dependencias externas
- 💨 Respuestas instantáneas para UI local
- 🔄 Lazy loading de funcionalidades no críticas

#### Compatibilidad
- 🌐 Todos los navegadores modernos (Chrome, Firefox, Safari, Edge)
- 📱 iOS Safari, Chrome Mobile, Samsung Internet
- 💻 Funciona offline (excepto conexiones API)
- 🌍 Internacionalización preparada (español por defecto)

#### Seguridad
- 🔐 API keys nunca enviadas a terceros
- 🛡️ Validación de entrada exhaustiva
- 🔒 Comunicación HTTPS obligatoria
- 🏠 Datos almacenados solo localmente

### 📋 Próximas Características Planeadas

#### v1.1.0
- 📂 Organización de chats en carpetas
- 🔍 Búsqueda en historial de conversaciones
- 📊 Exportar chats (TXT, MD, JSON)
- 🎨 Temas adicionales (claro, automático)

#### v1.2.0
- 🔊 Síntesis de voz para respuestas
- 📝 Plantillas de prompts predefinidos
- 🌐 Más proveedores (Cohere, Together AI)
- ⚡ Streaming para APIs externas

#### v1.3.0
- 🔗 Compartir conversaciones
- 👥 Múltiples perfiles de configuración
- 📈 Estadísticas de uso
- 🔌 Sistema de plugins

---

**Notas de Desarrollo:**
- Tiempo total de desarrollo: ~8 horas
- Líneas de código: ~2,000
- Tamaño total: < 50KB (sin minificar)
- Tiempo de carga: < 1 segundo

**Tested en:**
- ✅ Chrome 118+
- ✅ Firefox 119+
- ✅ Safari 17+
- ✅ Edge 118+
- ✅ Mobile Chrome (Android)
- ✅ Mobile Safari (iOS)