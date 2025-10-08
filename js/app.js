// Clase principal de la aplicación
class AppManager {
    constructor() {
        this.settings = {};
        this.isSettingsOpen = false;
        this.elements = {};
        this.wizard = null;
        
        this.init();
    }
    
    async init() {
        // Obtener elementos del DOM
        this.getElements();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Inicializar tema
        this.initializeTheme();
        
        // Cargar configuración guardada
        this.loadSettings();
        
        // Verificar si es la primera vez
        this.checkFirstTime();
        
        // Inicializar UI
        this.initializeUI();
        
        // Verificar conexión inicial
        await this.checkConnection();
    }
    
    getElements() {
        this.elements = {
            // Header
            themeToggleBtn: document.getElementById('themeToggleBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            clearChatBtn: document.getElementById('clearChatBtn'),
            exportChatBtn: document.getElementById('exportChatBtn'),
            headerModelSelect: document.getElementById('headerModelSelect'),
            
            // Settings Panel
            settingsPanel: document.getElementById('settingsPanel'),
            closeSettingsBtn: document.getElementById('closeSettingsBtn'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn'),
            
            // Settings Controls
            providerSelect: document.getElementById('providerSelect'),
            ollamaSettings: document.getElementById('ollamaSettings'),
            apiSettings: document.getElementById('apiSettings'),
            ollamaUrl: document.getElementById('ollamaUrl'),
            ollamaModel: document.getElementById('ollamaModel'),
            refreshModelsBtn: document.getElementById('refreshModelsBtn'),
            apiKey: document.getElementById('apiKey'),
            apiModel: document.getElementById('apiModel'),
            temperature: document.getElementById('temperature'),
            temperatureValue: document.getElementById('temperatureValue'),
            maxTokens: document.getElementById('maxTokens'),
            
            // Status
            connectionStatus: document.getElementById('connectionStatus')
        };
    }
    
    setupEventListeners() {
        // Botones del header
        this.elements.themeToggleBtn?.addEventListener('click', () => this.toggleTheme());
        this.elements.settingsBtn?.addEventListener('click', () => this.toggleSettings());
        this.elements.clearChatBtn?.addEventListener('click', () => this.clearChat());
        this.elements.exportChatBtn?.addEventListener('click', () => this.exportChat());
        
        // Header model selector
        this.elements.headerModelSelect?.addEventListener('change', (e) => {
            this.handleHeaderModelChange(e.target.value);
        });
        
        // Settings panel
        this.elements.closeSettingsBtn?.addEventListener('click', () => this.closeSettings());
        this.elements.saveSettingsBtn?.addEventListener('click', () => this.saveSettings());
        
        // Provider change
        this.elements.providerSelect?.addEventListener('change', (e) => {
            this.handleProviderChange(e.target.value);
        });
        
        // Refresh models
        this.elements.refreshModelsBtn?.addEventListener('click', () => {
            this.refreshOllamaModels();
        });
        
        // Temperature slider
        this.elements.temperature?.addEventListener('input', (e) => {
            this.elements.temperatureValue.textContent = e.target.value;
        });
        
        // Settings inputs
        const settingsInputs = [
            this.elements.ollamaUrl,
            this.elements.ollamaModel,
            this.elements.apiKey,
            this.elements.apiModel,
            this.elements.temperature,
            this.elements.maxTokens
        ];
        
        settingsInputs.forEach(input => {
            if (input) {
                input.addEventListener('change', () => this.updateConnectionStatus());
            }
        });
        
        // Cerrar settings al hacer click fuera
        document.addEventListener('click', (e) => {
            if (this.isSettingsOpen && 
                !this.elements.settingsPanel.contains(e.target) && 
                !this.elements.settingsBtn.contains(e.target)) {
                this.closeSettings();
            }
        });
        
        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case ',':
                        e.preventDefault();
                        this.toggleSettings();
                        break;
                    case 'k':
                        e.preventDefault();
                        this.clearChat();
                        break;
                }
            }
            
            if (e.key === 'Escape' && this.isSettingsOpen) {
                this.closeSettings();
            }
        });
    }
    
    async initializeUI() {
        // Configurar provider inicial
        this.handleProviderChange(this.settings.provider || CONFIG.defaults.provider);
        
        // Actualizar valores en la UI
        this.updateUIFromSettings();
        
        // Auto-refresh modelos de Ollama si es el proveedor por defecto
        if ((this.settings.provider || CONFIG.defaults.provider) === 'ollama') {
            await this.refreshOllamaModels();
        }
        
        // Inicializar selector del header
        this.updateHeaderModelSelector();
        
        // Actualizar estado de conexión
        this.updateConnectionStatus();
    }
    
    handleProviderChange(provider) {
        this.settings.provider = provider;
        
        // Mostrar/ocultar configuraciones relevantes
        if (provider === 'ollama') {
            this.elements.ollamaSettings?.classList.remove('hidden');
            this.elements.apiSettings?.classList.add('hidden');
        } else {
            this.elements.ollamaSettings?.classList.add('hidden');
            this.elements.apiSettings?.classList.remove('hidden');
            
            // Actualizar modelos para el proveedor
            this.updateApiModels(provider);
        }
        
        this.updateConnectionStatus();
    }
    
    handleHeaderModelChange(selectedValue) {
        // Extraer el modelo y proveedor del valor seleccionado
        const [model, provider] = this.parseHeaderModelValue(selectedValue);
        
        // Actualizar settings
        this.settings.model = model;
        if (provider) {
            this.settings.provider = provider;
            
            // Actualizar el selector de proveedor en settings
            if (this.elements.providerSelect) {
                this.elements.providerSelect.value = provider;
            }
            
            // Actualizar las configuraciones visibles
            this.handleProviderChange(provider);
        }
        
        // Actualizar el modelo en el selector correspondiente
        if (this.settings.provider === 'ollama') {
            if (this.elements.ollamaModel) {
                this.elements.ollamaModel.value = model;
            }
        } else {
            if (this.elements.apiModel) {
                this.elements.apiModel.value = model;
            }
        }
        
        // Guardar configuración
        this.saveSettings();
        
        // Actualizar estado de conexión
        this.updateConnectionStatus();
        
        // Mostrar notificación
        this.showNotification(`Modelo cambiado a: ${model}`, 'success');
    }
    
    parseHeaderModelValue(value) {
        // Si el valor contiene paréntesis, extraer el proveedor
        const match = value.match(/^(.+?)\s*\((.+?)\)$/);
        if (match) {
            const model = match[1].trim();
            const providerText = match[2].trim().toLowerCase();
            
            // Mapear el texto del proveedor
            const providerMap = {
                'ollama': 'ollama',
                'openai': 'openai',
                'anthropic': 'anthropic',
                'claude': 'anthropic',
                'groq': 'groq'
            };
            
            const provider = providerMap[providerText] || 'ollama';
            return [model, provider];
        }
        
        // Si no hay paréntesis, asumir que es Ollama
        return [value, 'ollama'];
    }
    
    updateApiModels(provider) {
        const models = aiProviders.getModelsForProvider(provider);
        const modelSelect = this.elements.apiModel;
        
        if (modelSelect) {
            modelSelect.innerHTML = '';
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
            
            // Seleccionar primer modelo si no hay uno guardado
            if (models.length > 0 && !this.settings.model) {
                modelSelect.value = models[0];
                this.settings.model = models[0];
            }
        }
    }
    
    async refreshOllamaModels() {
        const url = this.elements.ollamaUrl?.value || CONFIG.ollama.defaultUrl;
        const refreshBtn = this.elements.refreshModelsBtn;
        
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.textContent = 'Actualizando...';
        }
        
        try {
            const models = await aiProviders.getOllamaModels(url);
            const modelSelect = this.elements.ollamaModel;
            
            if (modelSelect) {
                const currentValue = modelSelect.value;
                modelSelect.innerHTML = '';
                
                if (models.length > 0) {
                    models.forEach(model => {
                        const option = document.createElement('option');
                        option.value = model.name;
                        option.textContent = `${model.name} (${this.formatBytes(model.size)})`;
                        modelSelect.appendChild(option);
                    });
                    
                    // Restaurar selección anterior si existe
                    if (currentValue && models.find(m => m.name === currentValue)) {
                        modelSelect.value = currentValue;
                    } else if (models.length > 0 && !this.settings.model) {
                        // Si no hay modelo seleccionado, usar el primero disponible
                        modelSelect.value = models[0].name;
                        this.settings.model = models[0].name;
                    }
                } else {
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'No hay modelos disponibles';
                    modelSelect.appendChild(option);
                }
            }
            
            this.updateConnectionStatus();
            
            // Actualizar el selector del header después de cargar los modelos
            this.updateHeaderModelSelector();
            
            // Notificación de éxito si se encontraron modelos
            if (models && models.length > 0) {
                console.log(`✅ ${models.length} modelos de Ollama encontrados:`, models.map(m => m.name));
                
                // Solo mostrar notificación si se ejecuta manualmente (no en inicialización)
                if (refreshBtn && refreshBtn.textContent === 'Actualizando...') {
                    this.showNotification(`${models.length} modelos encontrados`, 'success', 2000);
                }
            }
            
            return models;
            
        } catch (error) {
            console.error('Error actualizando modelos:', error);
            
            // Solo mostrar notificación de error si se ejecuta manualmente
            if (refreshBtn && refreshBtn.textContent === 'Actualizando...') {
                this.showNotification('Error al actualizar modelos de Ollama', 'error');
            }
            return [];
        } finally {
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.textContent = 'Actualizar Modelos';
            }
        }
    }
    
    updateHeaderModelSelector() {
        const headerSelect = this.elements.headerModelSelect;
        if (!headerSelect) return;
        
        const currentValue = headerSelect.value;
        headerSelect.innerHTML = '';
        
        // Agregar modelos de Ollama
        const ollamaModels = this.getAvailableOllamaModels();
        if (ollamaModels.length > 0) {
            ollamaModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = `${model} (Ollama)`;
                headerSelect.appendChild(option);
            });
        } else if (this.settings.provider === 'ollama') {
            // Si no hay modelos de Ollama pero es el proveedor seleccionado
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay modelos de Ollama disponibles';
            headerSelect.appendChild(option);
        }
        
        // Agregar modelos de APIs externas
        const providers = ['openai', 'anthropic', 'groq'];
        providers.forEach(provider => {
            const models = aiProviders.getModelsForProvider(provider);
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = `${model} (${provider})`;
                option.textContent = `${model} (${provider.charAt(0).toUpperCase() + provider.slice(1)})`;
                headerSelect.appendChild(option);
            });
        });
        
        // Si no hay opciones disponibles
        if (headerSelect.options.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay modelos disponibles';
            headerSelect.appendChild(option);
        }
        
        // Restaurar selección si es posible
        this.syncHeaderModelSelector();
    }
    
    getAvailableOllamaModels() {
        const ollamaSelect = this.elements.ollamaModel;
        if (!ollamaSelect) return [];
        
        const models = [];
        for (let i = 0; i < ollamaSelect.options.length; i++) {
            const option = ollamaSelect.options[i];
            if (option.value && option.value !== '') {
                models.push(option.value);
            }
        }
        return models;
    }
    
    syncHeaderModelSelector() {
        const headerSelect = this.elements.headerModelSelect;
        if (!headerSelect) return;
        
        const currentProvider = this.settings.provider || 'ollama';
        const currentModel = this.settings.model;
        
        if (currentModel) {
            // Buscar la opción correspondiente
            for (let i = 0; i < headerSelect.options.length; i++) {
                const option = headerSelect.options[i];
                const [model, provider] = this.parseHeaderModelValue(option.value);
                
                if (model === currentModel && provider === currentProvider) {
                    headerSelect.value = option.value;
                    break;
                }
            }
        }
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    async checkConnection() {
        const provider = this.settings.provider;
        const statusElement = this.elements.connectionStatus;
        
        if (!statusElement) return;
        
        const statusDot = statusElement.querySelector('.status-dot');
        const statusText = statusElement.querySelector('.status-dot').nextSibling;
        
        if (provider === 'ollama') {
            const url = this.settings.ollamaUrl || CONFIG.ollama.defaultUrl;
            
            statusDot.className = 'status-dot connecting';
            statusText.textContent = ' Conectando a Ollama...';
            
            const result = await aiProviders.checkOllamaConnection(url);
            
            if (result.success) {
                statusDot.className = 'status-dot connected';
                statusText.textContent = ' Conectado a Ollama';
            } else {
                statusDot.className = 'status-dot';
                statusText.textContent = ` Error: ${result.error}`;
            }
        } else {
            const hasApiKey = this.settings.apiKey && this.settings.apiKey.trim().length > 0;
            
            if (hasApiKey) {
                statusDot.className = 'status-dot connected';
                statusText.textContent = ` Configurado: ${CONFIG.providers[provider]?.name || provider}`;
            } else {
                statusDot.className = 'status-dot';
                statusText.textContent = ' API Key requerida';
            }
        }
    }
    
    updateConnectionStatus() {
        // Debounce la verificación de conexión
        clearTimeout(this.connectionCheckTimeout);
        this.connectionCheckTimeout = setTimeout(() => {
            this.checkConnection();
        }, 500);
    }
    
    updateUIFromSettings() {
        const elements = this.elements;
        
        if (elements.providerSelect) {
            elements.providerSelect.value = this.settings.provider || CONFIG.defaults.provider;
        }
        
        if (elements.ollamaUrl) {
            elements.ollamaUrl.value = this.settings.ollamaUrl || CONFIG.ollama.defaultUrl;
        }
        
        if (elements.ollamaModel) {
            elements.ollamaModel.value = this.settings.model || CONFIG.defaults.model;
        }
        
        if (elements.apiKey) {
            elements.apiKey.value = this.settings.apiKey || '';
        }
        
        if (elements.apiModel) {
            elements.apiModel.value = this.settings.model || '';
        }
        
        if (elements.temperature) {
            elements.temperature.value = this.settings.temperature || CONFIG.defaults.temperature;
            elements.temperatureValue.textContent = elements.temperature.value;
        }
        
        if (elements.maxTokens) {
            elements.maxTokens.value = this.settings.maxTokens || CONFIG.defaults.maxTokens;
        }
        
        // Sincronizar el selector del header
        this.syncHeaderModelSelector();
    }
    
    collectSettingsFromUI() {
        const provider = this.elements.providerSelect?.value;
        
        const settings = {
            provider: provider,
            temperature: parseFloat(this.elements.temperature?.value || CONFIG.defaults.temperature),
            maxTokens: parseInt(this.elements.maxTokens?.value || CONFIG.defaults.maxTokens)
        };
        
        if (provider === 'ollama') {
            settings.ollamaUrl = this.elements.ollamaUrl?.value || CONFIG.ollama.defaultUrl;
            settings.model = this.elements.ollamaModel?.value || CONFIG.defaults.model;
        } else {
            settings.apiKey = this.elements.apiKey?.value || '';
            settings.model = this.elements.apiModel?.value || '';
        }
        
        return settings;
    }
    
    saveSettings() {
        const newSettings = this.collectSettingsFromUI();
        
        // Validar configuración
        if (newSettings.provider !== 'ollama' && !newSettings.apiKey) {
            this.showNotification('API Key es requerida para este proveedor', 'error');
            return;
        }
        
        if (!newSettings.model) {
            this.showNotification('Debe seleccionar un modelo', 'warning');
            return;
        }
        
        // Guardar configuración
        this.settings = newSettings;
        Utils.saveToStorage(CONFIG.storage.keys.settings, this.settings);
        
        // Configurar proveedor
        aiProviders.setProvider(this.settings.provider, this.settings);
        
        // Actualizar estado
        this.updateConnectionStatus();
        
        // Cerrar panel
        this.closeSettings();
        
        // Notificar éxito
        this.showNotification('Configuración guardada exitosamente');
    }
    
    loadSettings() {
        this.settings = Utils.loadFromStorage(CONFIG.storage.keys.settings, CONFIG.defaults);
        
        // Configurar proveedor inicial
        aiProviders.setProvider(this.settings.provider, this.settings);
    }
    
    checkFirstTime() {
        const hasCompletedSetup = Utils.loadFromStorage('promptly_setup_completed', false);
        
        if (!hasCompletedSetup) {
            // Es la primera vez, mostrar wizard
            this.showSetupWizard();
        }
    }
    
    showSetupWizard() {
        this.wizard = new SetupWizard(this);
        this.wizard.show();
    }
    
    toggleSettings() {
        if (this.isSettingsOpen) {
            this.closeSettings();
        } else {
            this.openSettings();
        }
    }
    
    openSettings() {
        this.elements.settingsPanel?.classList.add('open');
        this.isSettingsOpen = true;
        
        // Auto-refresh modelos de Ollama si es necesario
        if (this.settings.provider === 'ollama') {
            this.refreshOllamaModels();
        }
    }
    
    closeSettings() {
        this.elements.settingsPanel?.classList.remove('open');
        this.isSettingsOpen = false;
    }
    
    clearChat() {
        Swal.fire({
            title: '¿Limpiar chat?',
            text: '¿Estás seguro de que quieres eliminar toda la conversación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            confirmButtonColor: 'var(--primary-color)',
            cancelButtonColor: 'var(--border)',
            customClass: {
                popup: 'swal-dark-theme'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                chatManager.clearChat();
                this.showNotification('Chat limpiado exitosamente');
            }
        });
    }
    
    exportChat() {
        if (!chatManager.messages || chatManager.messages.length === 0) {
            this.showNotification('No hay mensajes para exportar', 'warning');
            return;
        }

        Swal.fire({
            title: 'Exportar Chat',
            text: 'Selecciona el formato de exportación:',
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: '📄 Texto (.txt)',
            denyButtonText: '📋 Markdown (.md)',
            cancelButtonText: 'Cancelar',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            confirmButtonColor: 'var(--primary-color)',
            denyButtonColor: 'var(--secondary-color)',
            cancelButtonColor: 'var(--border)',
            customClass: {
                popup: 'swal-dark-theme'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Exportar como texto
                this.exportChatAsText();
            } else if (result.isDenied) {
                // Exportar como markdown
                this.exportChatAsMarkdown();
            }
        });
    }
    
    exportChatAsText() {
        const chatText = chatManager.messages.map(msg => {
            const role = msg.role === 'user' ? 'Usuario' : 'Asistente';
            const time = new Date(msg.timestamp).toLocaleString('es-ES');
            return `[${time}] ${role}: ${msg.content}`;
        }).join('\n\n');
        
        this.downloadFile(chatText, `promptly-chat-${Date.now()}.txt`, 'text/plain');
        this.showNotification('Chat exportado como texto', 'success');
    }
    
    exportChatAsMarkdown() {
        const chatMarkdown = [
            '# Chat Export - Promptly',
            `**Fecha**: ${new Date().toLocaleString('es-ES')}`,
            `**Mensajes**: ${chatManager.messages.length}`,
            '',
            '---',
            '',
            ...chatManager.messages.map(msg => {
                const role = msg.role === 'user' ? '🧑‍💻 **Usuario**' : '🤖 **Asistente**';
                const time = new Date(msg.timestamp).toLocaleString('es-ES');
                return `## ${role}\n*${time}*\n\n${msg.content}\n`;
            })
        ].join('\n');
        
        this.downloadFile(chatMarkdown, `promptly-chat-${Date.now()}.md`, 'text/markdown');
        this.showNotification('Chat exportado como Markdown', 'success');
    }
    
    // Funciones de tema
    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeButton();
        
        // Notificar el cambio
        const themeName = theme === 'dark' ? 'Tema Oscuro' : 'Tema Claro';
        this.showNotification(`Cambiado a ${themeName}`, 'success', 2000);
    }
    
    updateThemeButton() {
        const themeBtn = this.elements.themeToggleBtn;
        if (!themeBtn) return;
        
        const currentTheme = this.getCurrentTheme();
        const icon = themeBtn.querySelector('.material-icons');
        const label = themeBtn.querySelector('.btn-text');
        
        if (currentTheme === 'dark') {
            icon.textContent = 'light_mode';
            label.textContent = 'Tema Claro';
            themeBtn.classList.add('theme-active');
        } else {
            icon.textContent = 'dark_mode';
            label.textContent = 'Tema Oscuro';
            themeBtn.classList.remove('theme-active');
        }
    }
    
    initializeTheme() {
        // Cargar tema guardado o usar tema claro como default
        const savedTheme = localStorage.getItem('theme');
        
        // Por defecto usar tema claro, solo usar oscuro si está guardado o si el usuario lo prefiere explícitamente
        const theme = savedTheme || 'light';
        this.setTheme(theme);
        
        // Escuchar cambios en la preferencia del sistema solo si no hay tema guardado
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                // Mantener tema claro como default incluso si el sistema prefiere oscuro
                // Solo cambiar si el usuario ha interactuado explícitamente
            }
        });
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    showNotification(message, type = 'success', duration = 3000) {
        // Configuración de iconos y colores para SweetAlert2
        const config = {
            title: type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información',
            text: message,
            icon: type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: duration,
            timerProgressBar: true,
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            customClass: {
                popup: 'swal-dark-theme'
            },
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        };

        // Configuraciones específicas por tipo
        if (type === 'success') {
            config.iconColor = '#10b981';
        } else if (type === 'error') {
            config.iconColor = '#ef4444';
        } else if (type === 'warning') {
            config.iconColor = '#f59e0b';
        }

        Swal.fire(config);
    }
    
    getCurrentSettings() {
        return { ...this.settings };
    }
    
    isConfigured() {
        if (!this.settings.provider || !this.settings.model) {
            return false;
        }
        
        if (this.settings.provider !== 'ollama' && !this.settings.apiKey) {
            return false;
        }
        
        return true;
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.appManager = new AppManager();
});

// Manejar errores no capturados
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    if (window.appManager) {
        window.appManager.showNotification('Ha ocurrido un error inesperado', 'error');
    }
});

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada:', event.reason);
    if (window.appManager) {
        window.appManager.showNotification('Error de conexión', 'error');
    }
});