# 🛠️ Configuración de GitHub Pages

## Pasos para Configurar GitHub Pages con GitHub Actions

### 1. Ir a Configuración del Repositorio

1. Ve a tu repositorio: `https://github.com/YamiCueto/promptly`
2. Haz clic en la pestaña **"Settings"** (última pestaña del menú superior)

### 2. Configurar GitHub Pages

1. En el menú lateral izquierdo, busca y haz clic en **"Pages"**
2. En la sección **"Source"**:
   - ❌ NO selecciones "Deploy from a branch"
   - ✅ Selecciona **"GitHub Actions"**
3. Haz clic en **"Save"** si aparece el botón

### 3. Habilitar GitHub Actions

1. Ve a la pestaña **"Actions"** en tu repositorio
2. Si aparece un mensaje sobre workflows, haz clic en **"I understand my workflows, go ahead and enable them"**
3. Si no aparece nada, significa que ya están habilitados

### 4. Verificar Permisos

1. Ve a **Settings** > **Actions** > **General**
2. En **"Actions permissions"**, asegúrate de que esté seleccionado **"Allow all actions and reusable workflows"**
3. En **"Workflow permissions"**, selecciona **"Read and write permissions"**
4. Marca la casilla **"Allow GitHub Actions to create and approve pull requests"**

### 5. Ejecutar el Deploy

Después de configurar todo:

1. Haz cualquier cambio pequeño en el código (o deja un commit vacío):
   ```bash
   git commit --allow-empty -m "🚀 Trigger GitHub Pages deploy"
   git push origin main
   ```

2. Ve a **Actions** y verifica que el workflow "Deploy to GitHub Pages" se ejecute
3. Espera a que aparezca el ✅ verde
4. Tu sitio estará disponible en: `https://yamicueto.github.io/promptly`

## ⚠️ Solución de Problemas

### Si sigue apareciendo 404:

1. **Espera 5-10 minutos** después de que el workflow complete
2. Verifica que el workflow completó **exitosamente** (verde ✅)
3. Ve a **Settings** > **Pages** y confirma que dice "Your site is published at..."
4. Intenta acceder directamente: `https://yamicueto.github.io/promptly/index.html`

### Si el workflow falla:

1. Ve a **Actions** y haz clic en el workflow fallido
2. Revisa los logs de error
3. Los errores más comunes:
   - Permisos insuficientes → Revisa paso 4
   - Archivos faltantes → Verifica que todos los archivos estén en el repositorio
   - Error de sintaxis → Revisa los archivos .yml en `.github/workflows/`

### Si GitHub Actions no se ejecuta:

1. Ve a **Settings** > **Actions** > **General**
2. Asegúrate de que Actions esté habilitado
3. Verifica que tengas permisos de administrador en el repositorio

## 🎯 Resultado Esperado

Una vez configurado correctamente:

- ✅ Sitio web disponible en: `https://yamicueto.github.io/promptly`
- ✅ Deploy automático en cada push a `main`
- ✅ Badge de deploy en verde en el README
- ✅ Funcionalidad completa del chat AI

---

**¿Necesitas ayuda?** Abre un Issue en el repositorio con capturas de pantalla de cualquier error.