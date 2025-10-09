// Clase para manejar el wizard de configuración inicial
class SetupWizard {
    constructor(appManager) {
        this.app = appManager;
        this.currentStep = 1;
        this.totalSteps = 4;
        this.selectedProvider = null;
        this.wizardConfig = {};
        
        this.getElements();
        this.setupEventListeners();
    }
    
    getElements() {
        this.elements = {
            wizard: document.getElementById('setupWizard'),
            title: document.getElementById('wizardTitle'),
            progress: document.getElementById('wizardProgress'),
            progressText: document.getElementById('wizardProgressText'),
            steps: document.querySelectorAll('.wizard-step'),
            backBtn: document.getElementById('wizardBack'),
            nextBtn: document.getElementById('wizardNext'),
            finishBtn: document.getElementById('wizardFinish'),
            
            // Provider selection
            providerCards: document.querySelectorAll('.provider-card'),
            
            // Ollama configuration
            ollamaUrl: document.getElementById('wizardOllamaUrl'),
            ollamaStatus: document.getElementById('ollamaWizardStatus'),
            testOllamaBtn: document.getElementById('testOllamaConnection'),
            ollamaHelp: document.getElementById('ollamaHelp'),
            
            // API configuration
            apiProvider: document.getElementById('wizardApiProvider'),
            apiKey: document.getElementById('wizardApiKey'),
            
            // Completion
            completionSummary: document.getElementById('completionSummary')
        };
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.elements.backBtn.addEventListener('click', () => this.previousStep());
        this.elements.nextBtn.addEventListener('click', () => this.nextStep());
        this.elements.finishBtn.addEventListener('click', () => this.finish());
        
        // Provider selection
        this.elements.providerCards.forEach(card => {
            card.addEventListener('click', () => this.selectProvider(card));
        });
        
        // Ollama test connection
        this.elements.testOllamaBtn.addEventListener('click', () => this.testOllamaConnection());
        
        // API key input
        this.elements.apiKey.addEventListener('input', () => this.validateApiKey());
        
        // Close wizard on backdrop click
        this.elements.wizard.addEventListener('click', (e) => {
            if (e.target === this.elements.wizard) {
                this.hide();
            }
        });
    }
    
    show() {
        this.elements.wizard.classList.remove('hidden');
        this.updateProgress();
    }
    
    hide() {
        this.elements.wizard.classList.add('hidden');
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateWizard();
            }
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateWizard();
        }
    }
    
    updateWizard() {
        this.updateProgress();
        this.updateSteps();
        this.updateButtons();
        
        // Update specific step content
        if (this.currentStep === 3) {
            this.updateStep3();
        } else if (this.currentStep === 4) {
            this.updateCompletionSummary();
        }
    }
    
    updateProgress() {
        const percentage = (this.currentStep / this.totalSteps) * 100;
        this.elements.progress.style.width = `${percentage}%`;
        this.elements.progressText.textContent = `Paso ${this.currentStep} de ${this.totalSteps}`;
    }
    
    updateSteps() {
        this.elements.steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
                
                // Handle provider-specific steps
                if (stepNumber === 3) {
                    const isOllamaStep = step.dataset.provider === 'ollama';
                    const isExternalStep = step.dataset.provider === 'external';
                    
                    if (this.selectedProvider === 'ollama' && isOllamaStep) {
                        step.classList.add('active');
                    } else if (this.selectedProvider === 'external' && isExternalStep) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                }
            }
        });
    }
    
    updateButtons() {
        // Back button
        this.elements.backBtn.disabled = this.currentStep === 1;
        
        // Next/Finish buttons
        if (this.currentStep === this.totalSteps) {
            this.elements.nextBtn.classList.add('hidden');
            this.elements.finishBtn.classList.remove('hidden');
        } else {
            this.elements.nextBtn.classList.remove('hidden');
            this.elements.finishBtn.classList.add('hidden');
        }
        
        // Validate next button state
        this.elements.nextBtn.disabled = !this.validateCurrentStep();
    }
    
    updateStep3() {
        // Show the appropriate configuration step based on selected provider
        const ollamaStep = document.querySelector('.wizard-step[data-step="3"][data-provider="ollama"]');
        const externalStep = document.querySelector('.wizard-step[data-step="3"][data-provider="external"]');
        
        if (this.selectedProvider === 'ollama') {
            ollamaStep.classList.add('active');
            externalStep.classList.remove('active');
        } else {
            externalStep.classList.add('active');
            ollamaStep.classList.remove('active');
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return true; // Welcome step is always valid
                
            case 2:
                return this.selectedProvider !== null;
                
            case 3:
                if (this.selectedProvider === 'ollama') {
                    return this.validateOllamaConfig();
                } else {
                    return this.validateApiConfig();
                }
                
            case 4:
                return true; // Completion step is always valid
                
            default:
                return false;
        }
    }
    
    validateOllamaConfig() {
        const url = this.elements.ollamaUrl.value.trim();
        const hasConnection = this.elements.ollamaStatus.classList.contains('connected');
        return url && hasConnection;
    }
    
    validateApiConfig() {
        const provider = this.elements.apiProvider.value;
        const apiKey = this.elements.apiKey.value.trim();
        return provider && apiKey.length > 10; // Basic validation
    }
    
    selectProvider(card) {
        // Remove selection from all cards
        this.elements.providerCards.forEach(c => c.classList.remove('selected'));
        
        // Select clicked card
        card.classList.add('selected');
        this.selectedProvider = card.dataset.provider;
        
        // Update buttons
        this.updateButtons();
    }
    
    async testOllamaConnection() {
        const url = this.elements.ollamaUrl.value.trim();
        const statusElement = this.elements.ollamaStatus;
        const statusText = statusElement.querySelector('.status-text');
        
        if (!url) {
            this.showOllamaError('Por favor ingresa una URL válida');
            return;
        }
        
        // Show connecting state
        statusElement.className = 'ollama-status connecting';
        statusText.textContent = 'Conectando a Ollama...';
        this.elements.testOllamaBtn.disabled = true;
        
        try {
            const result = await aiProviders.checkOllamaConnection(url);
            
            if (result.success) {
                statusElement.className = 'ollama-status connected';
                statusText.textContent = `✅ Conectado exitosamente (${result.models?.length || 0} modelos disponibles)`;
                this.hideOllamaHelp();
                
                // Store the URL for later use
                this.wizardConfig.ollamaUrl = url;
                this.wizardConfig.ollamaModels = result.models || [];
            } else {
                this.showOllamaError(`❌ Error: ${result.error}`);
                this.showOllamaHelp();
            }
        } catch (error) {
            // Detectar errores de CORS específicamente
            if (error.message.includes('CORS') || 
                error.message.includes('blocked') || 
                error.message.includes('Access-Control-Allow-Origin')) {
                this.showCorsError();
            } else {
                this.showOllamaError(`❌ Error de conexión: ${error.message}`);
                this.showOllamaHelp();
            }
        }
        
        this.elements.testOllamaBtn.disabled = false;
        this.updateButtons();
    }
    
    showCorsError() {
        const statusElement = this.elements.ollamaStatus;
        const statusText = statusElement.querySelector('.status-text');
        
        statusElement.className = 'ollama-status error';
        statusText.innerHTML = `
            ❌ <strong>Error de CORS detectado</strong><br>
            <small>GitHub Pages (HTTPS) no puede conectar a localhost (HTTP)</small>
        `;
        
        // Mostrar ayuda específica para CORS
        this.showCorsHelp();
    }
    
    showCorsHelp() {
        const helpElement = this.elements.ollamaHelp;
        helpElement.innerHTML = `
            <div class="cors-help">
                <h4>🔧 Soluciones para el Error de CORS:</h4>
                <div class="cors-solution">
                    <h5>📋 Opción 1: Configurar Ollama (Recomendado)</h5>
                    <ol>
                        <li>Cierra Ollama completamente</li>
                        <li>Abre CMD como administrador</li>
                        <li>Ejecuta: <code>setx OLLAMA_ORIGINS "*"</code></li>
                        <li>Ejecuta: <code>setx OLLAMA_HOST "0.0.0.0:11434"</code></li>
                        <li>Reinicia tu computadora</li>
                        <li>Inicia Ollama: <code>ollama serve</code></li>
                    </ol>
                </div>
                <div class="cors-solution">
                    <h5>🌐 Opción 2: Usar Proxy HTTPS</h5>
                    <ol>
                        <li>Instala ngrok: <a href="https://ngrok.com/download" target="_blank">ngrok.com/download</a></li>
                        <li>Ejecuta: <code>ngrok http 11434</code></li>
                        <li>Usa la URL HTTPS que te da ngrok</li>
                    </ol>
                </div>
                <div class="cors-solution">
                    <h5>💻 Opción 3: Usar Localmente</h5>
                    <p>Ejecuta Promptly desde tu computadora con un servidor local para evitar CORS.</p>
                </div>
            </div>
        `;
        helpElement.classList.remove('hidden');
    }
    
    showOllamaHelp() {
        this.elements.ollamaHelp.classList.remove('hidden');
    }
    
    hideOllamaHelp() {
        this.elements.ollamaHelp.classList.add('hidden');
    }
    
    showOllamaError(message) {
        const statusElement = this.elements.ollamaStatus;
        const statusText = statusElement.querySelector('.status-text');
        
        statusElement.className = 'ollama-status error';
        statusText.textContent = message;
    }
    
    validateApiKey() {
        const apiKey = this.elements.apiKey.value.trim();
        const provider = this.elements.apiProvider.value;
        
        if (apiKey.length > 10) {
            this.wizardConfig.apiProvider = provider;
            this.wizardConfig.apiKey = apiKey;
        }
        
        this.updateButtons();
    }
    
    updateCompletionSummary() {
        const summary = this.elements.completionSummary;
        let summaryHTML = '<h4>📋 Configuración guardada:</h4>';
        
        if (this.selectedProvider === 'ollama') {
            summaryHTML += `
                <div class="summary-item">
                    <span class="summary-label">Proveedor:</span>
                    <span class="summary-value">Ollama Local</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">URL:</span>
                    <span class="summary-value">${this.wizardConfig.ollamaUrl}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Modelos disponibles:</span>
                    <span class="summary-value">${this.wizardConfig.ollamaModels?.length || 0}</span>
                </div>
            `;
        } else {
            const providerNames = {
                'openai': 'OpenAI',
                'anthropic': 'Anthropic (Claude)',
                'groq': 'Groq'
            };
            
            summaryHTML += `
                <div class="summary-item">
                    <span class="summary-label">Proveedor:</span>
                    <span class="summary-value">${providerNames[this.wizardConfig.apiProvider]}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">API Key:</span>
                    <span class="summary-value">●●●●●●●●${this.wizardConfig.apiKey.slice(-4)}</span>
                </div>
            `;
        }
        
        summary.innerHTML = summaryHTML;
    }
    
    async finish() {
        // Save configuration to app settings
        if (this.selectedProvider === 'ollama') {
            this.app.settings = {
                ...this.app.settings,
                provider: 'ollama',
                ollamaUrl: this.wizardConfig.ollamaUrl,
                model: this.wizardConfig.ollamaModels?.[0]?.name || 'llama3.2'
            };
        } else {
            const defaultModels = {
                'openai': 'gpt-3.5-turbo',
                'anthropic': 'claude-3-sonnet-20240229',
                'groq': 'llama3-70b-8192'
            };
            
            this.app.settings = {
                ...this.app.settings,
                provider: this.wizardConfig.apiProvider,
                apiKey: this.wizardConfig.apiKey,
                model: defaultModels[this.wizardConfig.apiProvider]
            };
        }
        
        // Save settings
        Utils.saveToStorage(CONFIG.storage.keys.settings, this.app.settings);
        Utils.saveToStorage('promptly_setup_completed', true);
        
        // Configure AI provider
        aiProviders.setProvider(this.app.settings.provider, this.app.settings);
        
        // Update app UI
        this.app.updateUIFromSettings();
        await this.app.refreshOllamaModels();
        this.app.updateHeaderModelSelector();
        this.app.updateConnectionStatus();
        
        // Show success notification
        this.app.showNotification('¡Configuración completada exitosamente! 🎉', 'success');
        
        // Hide wizard
        this.hide();
    }
}

// Crear instancia global si no existe
if (typeof window !== 'undefined') {
    window.SetupWizard = SetupWizard;
}