// Clase para manejar diferentes proveedores de AI
class AIProviders {
    constructor() {
        this.currentProvider = null;
        this.currentSettings = {};
        this.corsHandler = new CORSHandler();
    }
    
    // Configurar proveedor actual
    setProvider(provider, settings) {
        this.currentProvider = provider;
        this.currentSettings = settings;
    }
    
    // Verificar conexión con Ollama usando CORS handler inteligente
    async checkOllamaConnection(url) {
        try {
            // Intentar detectar estrategia CORS funcional
            await this.corsHandler.findWorkingStrategy(`${url}/api/tags`);
            
            const response = await this.corsHandler.makeRequest(`${url}/api/tags`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    models: data.models || [],
                    corsStrategy: this.corsHandler.workingStrategy.name
                };
            }
            
            return {
                success: false,
                error: `Error HTTP: ${response.status}`
            };
        } catch (error) {
            // Si hay error de CORS, mostrar wizard
            if (error.message.includes('CORS') || error.message.includes('fetch')) {
                this.showCORSWizard();
                return {
                    success: false,
                    error: 'Error de CORS detectado',
                    showWizard: true
                };
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Mostrar wizard de CORS
    async showCORSWizard() {
        const wizard = new CORSWizard();
        await wizard.start();
    }
    
    // Obtener modelos de Ollama con CORS handler
    async getOllamaModels(url) {
        try {
            const response = await this.corsHandler.makeRequest(`${url}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                return data.models.map(model => ({
                    name: model.name,
                    size: model.size,
                    modified_at: model.modified_at
                }));
            }
            throw new Error(`Error: ${response.status}`);
        } catch (error) {
            console.error('Error obteniendo modelos de Ollama:', error);
            return [];
        }
    }
    
    // Enviar mensaje a Ollama
    async sendToOllama(message, options = {}) {
        const {
            url = CONFIG.ollama.defaultUrl,
            model = 'llama3.2',
            temperature = 0.7,
            stream = false
        } = options;
        
        try {
            const response = await fetch(`${url}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    prompt: message,
                    temperature: temperature,
                    stream: stream
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            if (stream) {
                return this.handleOllamaStream(response);
            } else {
                const data = await response.json();
                return {
                    success: true,
                    response: data.response,
                    model: data.model,
                    total_duration: data.total_duration
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Manejar stream de Ollama
    async handleOllamaStream(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            fullResponse += data.response;
                            // Emitir evento para actualización en tiempo real
                            window.dispatchEvent(new CustomEvent('ollamaChunk', {
                                detail: { chunk: data.response, full: fullResponse }
                            }));
                        }
                    } catch (e) {
                        // Ignorar líneas que no son JSON válido
                    }
                }
            }
            
            return {
                success: true,
                response: fullResponse
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Enviar mensaje a OpenAI
    async sendToOpenAI(message, options = {}) {
        const {
            apiKey,
            model = 'gpt-3.5-turbo',
            temperature = 0.7,
            maxTokens = 2048
        } = options;
        
        if (!apiKey) {
            return {
                success: false,
                error: 'API Key de OpenAI requerida'
            };
        }
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: message }],
                    temperature: temperature,
                    max_tokens: maxTokens
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                response: data.choices[0].message.content,
                model: data.model,
                usage: data.usage
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Enviar mensaje a Anthropic
    async sendToAnthropic(message, options = {}) {
        const {
            apiKey,
            model = 'claude-3-sonnet-20240229',
            temperature = 0.7,
            maxTokens = 2048
        } = options;
        
        if (!apiKey) {
            return {
                success: false,
                error: 'API Key de Anthropic requerida'
            };
        }
        
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: maxTokens,
                    temperature: temperature,
                    messages: [{ role: 'user', content: message }]
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                response: data.content[0].text,
                model: data.model,
                usage: data.usage
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Enviar mensaje a Groq
    async sendToGroq(message, options = {}) {
        const {
            apiKey,
            model = 'llama3-70b-8192',
            temperature = 0.7,
            maxTokens = 2048
        } = options;
        
        if (!apiKey) {
            return {
                success: false,
                error: 'API Key de Groq requerida'
            };
        }
        
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: message }],
                    temperature: temperature,
                    max_tokens: maxTokens
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                response: data.choices[0].message.content,
                model: data.model,
                usage: data.usage
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Método principal para enviar mensajes
    async sendMessage(message, options = {}) {
        const provider = options.provider || this.currentProvider;
        const settings = { ...this.currentSettings, ...options };
        
        switch (provider) {
            case 'ollama':
                return await this.sendToOllama(message, settings);
            case 'openai':
                return await this.sendToOpenAI(message, settings);
            case 'anthropic':
                return await this.sendToAnthropic(message, settings);
            case 'groq':
                return await this.sendToGroq(message, settings);
            default:
                return {
                    success: false,
                    error: 'Proveedor no soportado'
                };
        }
    }
    
    // Verificar si un proveedor requiere API key
    requiresApiKey(provider) {
        return provider !== 'ollama';
    }
    
    // Obtener modelos para un proveedor
    getModelsForProvider(provider) {
        if (provider === 'ollama') {
            return []; // Se obtienen dinámicamente
        }
        return CONFIG.providers[provider]?.models || [];
    }
}

// Crear instancia global
const aiProviders = new AIProviders();