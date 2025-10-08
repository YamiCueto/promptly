// Clase principal de la aplicación
class AppManager {
    constructor() {
        this.settings = {};
        this.isSettingsOpen = false;
        this.elements = {};
        
        this.init();
    }
    
    async init() {
        // Obtener elementos del DOM
        this.getElements();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar configuración guardada
        this.loadSettings();
        
        // Inicializar UI
        this.initializeUI();
        
        // Verificar conexión inicial
        await this.checkConnection();
    }
    
    getElements() {
        this.elements = {
            // Header
            settingsBtn: document.getElementById('settingsBtn'),
            clearChatBtn: document.getElementById('clearChatBtn'),
            
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
        this.elements.settingsBtn?.addEventListener('click', () => this.toggleSettings());
        this.elements.clearChatBtn?.addEventListener('click', () => this.clearChat());
        
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
    
    initializeUI() {
        // Configurar provider inicial
        this.handleProviderChange(this.settings.provider || CONFIG.defaults.provider);
        
        // Actualizar valores en la UI
        this.updateUIFromSettings();
        
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
                    }
                } else {
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'No hay modelos disponibles';
                    modelSelect.appendChild(option);
                }
            }
            
            this.updateConnectionStatus();
        } catch (error) {
            console.error('Error actualizando modelos:', error);
        }
        
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = 'Actualizar Modelos';
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
            alert('API Key es requerida para este proveedor');
            return;
        }
        
        if (!newSettings.model) {
            alert('Debe seleccionar un modelo');
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
        if (confirm('¿Estás seguro de que quieres limpiar todo el chat?')) {
            chatManager.clearChat();
            this.showNotification('Chat limpiado');
        }
    }
    
    showNotification(message, type = 'success') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Estilos
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1001',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
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