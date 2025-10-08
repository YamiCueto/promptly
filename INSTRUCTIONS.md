# 📋 Instrucciones Completas - Promptly

## 🚀 Configuración Inicial del Proyecto

### 1. Clonar y Configurar el Repositorio

```bash
git clone https://github.com/YamiCueto/promptly.git
cd promptly
npm install
```

### 2. Configurar GitHub Pages

**IMPORTANTE**: Debes configurar GitHub Pages para que funcione correctamente.

1. Ve a tu repositorio en GitHub: `https://github.com/YamiCueto/promptly`
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, busca **Pages**
4. En **Source**, selecciona **GitHub Actions** (NO "Deploy from a branch")
5. Guarda los cambios

### 3. Habilitar Workflows de GitHub Actions

1. Ve a la pestaña **Actions** en tu repositorio
2. Si aparece un mensaje para habilitar workflows, haz clic en **"I understand my workflows, go ahead and enable them"**
3. Los workflows se ejecutarán automáticamente en el próximo push

## 🔧 Desarrollo Local

### Comandos Disponibles

```bash
# Iniciar servidor local en puerto 8000
npm start

# Desarrollo con auto-reload (abre automáticamente el navegador)
npm run dev

# Validar proyecto (estructura, sintaxis, HTML)
npm test

# Mostrar información del proyecto
npm run info

# Servir archivos (alias de npm start)
npm run serve
```

### Probar Localmente

1. Ejecuta `npm start` o `npm run dev`
2. Abre `http://localhost:8000` en tu navegador
3. Configura tu proveedor de IA preferido
4. ¡Comienza a chatear!

## 📝 Convenciones de Git y Commits

### ⚠️ REGLA IMPORTANTE PARA COMMITS

**TODOS los commits deben ser de UNA SOLA LÍNEA sin saltos de carro** para evitar que se dañe el formato de los mensajes descriptivos al ejecutarlos desde la consola de Windows.

#### ✅ Formato Correcto de Commits:

```bash
# ✅ CORRECTO - Una sola línea
git commit -m "🚀 Add new feature: dark theme toggle"

# ✅ CORRECTO - Emoji + descripción concisa
git commit -m "🐛 Fix responsive design on mobile devices"

# ✅ CORRECTO - Máximo 72 caracteres
git commit -m "📝 Update README with installation instructions"
```

#### ❌ Formato INCORRECTO:

```bash
# ❌ INCORRECTO - Múltiples líneas causan problemas en Windows CMD
git commit -m "🚀 Add new feature
- Dark theme toggle
- User preferences
- Better UX"

# ❌ INCORRECTO - Saltos de línea rompen el formato
git commit -m "Fix bug:
The responsive design was broken"
```

### 🏷️ Convención de Mensajes

Usa este formato para commits consistentes:

```
[emoji] [tipo]: [descripción concisa en 50-72 caracteres]
```

#### Emojis Recomendados:

- 🚀 `:rocket:` - Nueva funcionalidad
- 🐛 `:bug:` - Corrección de errores
- 📝 `:memo:` - Documentación
- 🎨 `:art:` - Mejoras de UI/UX
- ⚡ `:zap:` - Mejoras de rendimiento
- 🔧 `:wrench:` - Configuración
- 🔒 `:lock:` - Seguridad
- 🌐 `:globe_with_meridians:` - Internacionalización
- 📦 `:package:` - Dependencias
- 🔀 `:twisted_rightwards_arrows:` - Merge

#### Ejemplos de Buenos Commits:

```bash
git commit -m "🚀 Add Groq API provider support"
git commit -m "🐛 Fix chat scroll behavior on mobile"
git commit -m "📝 Update API configuration documentation"
git commit -m "🎨 Improve settings panel animation"
git commit -m "⚡ Optimize CSS loading performance"
git commit -m "🔧 Configure GitHub Actions deployment"
```

## 🌐 Deploy y GitHub Pages

### Proceso Automático

El deploy es **completamente automático**:

1. Haz push a la rama `main`
2. GitHub Actions ejecuta el workflow
3. El sitio se despliega automáticamente
4. Disponible en: `https://yamicueto.github.io/promptly`

### Verificar Deploy

1. Ve a **Actions** en tu repositorio
2. Busca el workflow "Deploy to GitHub Pages"
3. Verifica que esté en verde ✅
4. Si hay errores ❌, revisa los logs

### Troubleshooting Deploy

**Si el sitio muestra 404:**

1. Verifica que GitHub Pages esté configurado como **GitHub Actions** (no "Deploy from a branch")
2. Asegúrate de que los workflows estén habilitados
3. Espera 5-10 minutos después del deploy
4. Verifica que el workflow completó exitosamente

**Si los workflows no se ejecutan:**

1. Ve a **Settings** > **Actions** > **General**
2. Asegúrate de que esté marcado "Allow all actions and reusable workflows"
3. Verifica que tengas permisos de escritura en el repositorio

## 🔑 Configuración de APIs

### Ollama Local

1. **Instala Ollama**: Descarga desde [ollama.ai](https://ollama.ai)
2. **Descarga un modelo**:
   ```bash
   ollama pull llama3.2
   ollama pull mistral
   ```
3. **Inicia Ollama**:
   ```bash
   ollama serve
   ```
4. **En Promptly**:
   - Selecciona "Ollama (Local)"
   - URL: `http://localhost:11434`
   - Haz clic en "Actualizar Modelos"

### APIs Externas

#### OpenAI
1. Registra cuenta en [platform.openai.com](https://platform.openai.com)
2. Ve a API Keys y crea una nueva
3. En Promptly: Proveedor "OpenAI" + tu API key

#### Anthropic (Claude)
1. Registra cuenta en [console.anthropic.com](https://console.anthropic.com)
2. Genera API key en configuración
3. En Promptly: Proveedor "Anthropic" + tu API key

#### Groq
1. Registra cuenta en [console.groq.com](https://console.groq.com)
2. Crea API key gratuita
3. En Promptly: Proveedor "Groq" + tu API key

## 🛠️ Desarrollo y Contribuciones

### Estructura del Proyecto

```
promptly/
├── index.html              # 🏠 Página principal
├── css/styles.css          # 🎨 Estilos principales
├── js/
│   ├── config.js          # ⚙️ Configuración global
│   ├── providers.js       # 🔌 Gestión de APIs
│   ├── chat.js            # 💬 Lógica del chat
│   └── app.js             # 🎯 Aplicación principal
├── .github/workflows/      # 🤖 GitHub Actions
├── README.md              # 📖 Documentación principal
├── DEPLOY.md              # 🚀 Guía de deploy
├── CHANGELOG.md           # 📋 Historial de cambios
└── package.json           # 📦 Configuración npm
```

### Workflow de Desarrollo

1. **Crear rama para feature**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollar y probar localmente**:
   ```bash
   npm run dev
   npm test
   ```

3. **Commit con formato correcto**:
   ```bash
   git add .
   git commit -m "🚀 Add nueva funcionalidad increíble"
   ```

4. **Push y crear Pull Request**:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

5. **Merge a main** (triggerea deploy automático)

### Testing Local

```bash
# Validar estructura y sintaxis
npm test

# Iniciar servidor y probar manualmente
npm run dev

# Verificar que todos los archivos están correctos
npm run validate
```

## 🚨 Resolución de Problemas

### Problemas Comunes

**1. GitHub Pages muestra 404**
- Configurar Source como "GitHub Actions"
- Esperar a que complete el workflow
- Verificar permisos en Settings > Actions

**2. Workflows no se ejecutan**
- Habilitar Actions en configuración del repo
- Verificar que tienes permisos de admin
- Revisar sintaxis de archivos .yml

**3. Ollama no conecta**
- Verificar que Ollama esté ejecutándose: `ollama serve`
- Comprobar URL: `http://localhost:11434`
- Deshabilitar firewall temporalmente si es necesario

**4. APIs externas fallan**
- Verificar API key correcta
- Comprobar límites de uso
- Revisar formato de requests en DevTools

### Logs y Debugging

```bash
# Ver estado del repositorio
git status

# Ver historial de commits
git log --oneline

# Ver diferencias
git diff

# Verificar estructura de archivos
npm run validate:structure
```

## 📞 Soporte

Si tienes problemas:

1. **Revisa esta guía completa**
2. **Consulta logs de GitHub Actions**
3. **Abre un Issue en el repositorio**
4. **Verifica la documentación de APIs externas**

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. ✅ Personaliza la interfaz
2. ✅ Configura tus proveedores preferidos
3. ✅ Comparte el link: `https://yamicueto.github.io/promptly`
4. ✅ Contribuye con nuevas funcionalidades

---

**¡Listo para usar Promptly!** 🎉

Recuerda: **Commits de UNA sola línea** para evitar problemas en Windows CMD.