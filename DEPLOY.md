# Documentación de Deploy

## 🚀 Deploy Automático con GitHub Actions

Este proyecto está configurado para deploy automático en GitHub Pages usando GitHub Actions.

### ⚙️ Configuración

1. **Habilitar GitHub Pages:**
   - Ve a `Settings` > `Pages` en tu repositorio
   - En `Source`, selecciona `GitHub Actions`
   - ¡Listo! El deploy se ejecutará automáticamente

2. **Workflows Configurados:**
   - 📦 **Deploy (`deploy.yml`)**: Deploy automático en cada push a `main`
   - 🔍 **CI (`ci.yml`)**: Tests y validaciones en cada push/PR

### 🔄 Proceso de Deploy

1. **Trigger**: Push a rama `main`
2. **Build**: Prepara archivos estáticos
3. **Deploy**: Publica en GitHub Pages
4. **URL**: `https://yamicueto.github.io/promptly`

### 📊 Status Badges

Puedes agregar estos badges a tu README:

```markdown
![Deploy Status](https://github.com/YamiCueto/promptly/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
![CI Status](https://github.com/YamiCueto/promptly/workflows/CI/badge.svg)
```

### 🛠️ Deploy Manual

Si necesitas hacer deploy manual:

```bash
# Opción 1: Via GitHub Actions UI
# Ve a Actions > Deploy to GitHub Pages > Run workflow

# Opción 2: Via comandos locales
npm run build
npm run deploy
```

### 🔧 Personalización

Para personalizar el deploy, edita `.github/workflows/deploy.yml`:

- **Cambiar rama**: Modifica `branches: [ main ]`
- **Agregar optimizaciones**: Añade steps de minificación
- **Variables de entorno**: Configura secrets en GitHub

### 📁 Estructura de Deploy

```
dist/                    # Directorio de salida
├── index.html          # Página principal
├── favicon.ico         # Favicon
├── package.json        # Metadata
├── css/
│   └── styles.css      # Estilos
└── js/
    ├── config.js       # Configuración
    ├── providers.js    # Proveedores AI
    ├── chat.js         # Lógica del chat
    └── app.js          # App principal
```

### 🚨 Troubleshooting

**Deploy falla:**
1. Verifica permisos en `Settings` > `Actions` > `General`
2. Asegúrate que GitHub Pages esté habilitado
3. Revisa logs en `Actions` tab

**404 Error:**
1. Verifica que `index.html` existe en la raíz
2. Asegúrate que el archivo `.nojekyll` se creó
3. Espera unos minutos para propagación

**JavaScript no funciona:**
1. Verifica rutas relativas en HTML
2. Checa errores en Console del navegador
3. Asegúrate que todos los archivos JS se desplegaron

### 🔄 Rollback

Para revertir a una versión anterior:

```bash
git revert <commit-hash>
git push origin main
```

El deploy automático revertirá los cambios.