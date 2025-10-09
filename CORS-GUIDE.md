# 🔧 Guía para Solucionar Errores de CORS con Ollama

## 🚨 **Problema: Error de CORS**

Cuando usas Promptly desde GitHub Pages (`https://yamicueto.github.io/promptly`) e intentas conectar a tu Ollama local (`http://localhost:11434`), obtienes un error como:

```
Access to fetch at 'http://localhost:11434/api/tags' from origin 'https://yamicueto.github.io' has been blocked by CORS policy
```

**¿Por qué ocurre esto?**
- GitHub Pages sirve tu app por HTTPS (seguro)
- Ollama corre en HTTP localhost (no seguro)
- Los navegadores bloquean estas conexiones por seguridad (CORS)

## ✅ **Soluciones**

### **Opción 1: Configurar CORS en Ollama (Recomendado)**

#### Para Windows:

1. **Cierra Ollama completamente**
   - Cierra la aplicación Ollama
   - Ve al Task Manager y termina cualquier proceso `ollama.exe`

2. **Configura las variables de entorno**
   - Abre **CMD como Administrador**
   - Ejecuta estos comandos:
   ```cmd
   setx OLLAMA_ORIGINS "*"
   setx OLLAMA_HOST "0.0.0.0:11434"
   ```

3. **Reinicia tu computadora** (importante para que las variables se carguen)

4. **Inicia Ollama**
   ```cmd
   ollama serve
   ```

#### Para macOS/Linux:

1. **Edita tu archivo de perfil**
   ```bash
   # Para bash
   nano ~/.bashrc
   
   # Para zsh
   nano ~/.zshrc
   ```

2. **Agrega estas líneas al final**
   ```bash
   export OLLAMA_ORIGINS="*"
   export OLLAMA_HOST="0.0.0.0:11434"
   ```

3. **Recarga el perfil**
   ```bash
   source ~/.bashrc  # o ~/.zshrc
   ```

4. **Reinicia Ollama**
   ```bash
   ollama serve
   ```

### **Opción 2: Usar un Proxy HTTPS con ngrok**

1. **Instala ngrok**
   - Ve a [ngrok.com/download](https://ngrok.com/download)
   - Descarga e instala ngrok

2. **Crea el tunnel HTTPS**
   ```bash
   ngrok http 11434
   ```

3. **Usa la URL HTTPS**
   - ngrok te dará una URL como `https://abc123.ngrok.io`
   - Usa esta URL en Promptly en lugar de `http://localhost:11434`

### **Opción 3: Ejecutar Promptly Localmente**

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/YamiCueto/promptly.git
   cd promptly
   ```

2. **Inicia un servidor local**
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx http-server
   
   # Con VS Code Live Server
   # Instala la extensión y haz clic derecho en index.html
   ```

3. **Accede localmente**
   - Ve a `http://localhost:8000`
   - Ahora no habrá problemas de CORS (ambos son HTTP)

### **Opción 4: Script Automático (Windows)**

Hemos creado un script que hace todo automáticamente:

1. **Descarga el script** `setup-ollama-cors.bat` del repositorio
2. **Ejecuta como Administrador**
3. **Sigue las instrucciones en pantalla**

## 🔍 **Verificar que Funciona**

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña Network**
3. **Intenta conectar a Ollama desde Promptly**
4. **Busca la petición a `/api/tags`**
   - ✅ **Verde**: CORS solucionado
   - ❌ **Rojo**: Aún hay problemas

## 🆘 **Troubleshooting**

### Si la Opción 1 no funciona:

1. **Verifica las variables**
   ```cmd
   echo %OLLAMA_ORIGINS%
   echo %OLLAMA_HOST%
   ```

2. **Reinicia completamente**
   - Cierra Ollama
   - Reinicia tu computadora
   - Inicia Ollama otra vez

3. **Verifica que Ollama escuche en todas las interfaces**
   ```bash
   netstat -an | findstr 11434
   ```
   - Debería mostrar `0.0.0.0:11434` en lugar de `127.0.0.1:11434`

### Si ngrok (Opción 2) es lento:

- ngrok gratuito tiene limitaciones de velocidad
- Considera usar la Opción 1 o 3 para mejor rendimiento

### Si sigues teniendo problemas:

1. **Revisa el firewall** - asegúrate de que permita Ollama
2. **Prueba con otro navegador** - algunos tienen políticas CORS más estrictas
3. **Verifica la versión de Ollama** - actualiza a la última versión

## 🎯 **Recomendación Final**

Para la mejor experiencia:
1. **Usa la Opción 1** (configurar CORS) para uso regular
2. **Usa la Opción 3** (servidor local) para desarrollo
3. **Usa la Opción 2** (ngrok) solo temporalmente

¡Con estas soluciones deberías poder usar Promptly desde GitHub Pages sin problemas de CORS! 🚀