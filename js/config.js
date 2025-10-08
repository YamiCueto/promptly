// Configuración de la aplicación
const CONFIG = {
    // Configuración de Ollama
    ollama: {
        defaultUrl: 'http://localhost:11434',
        endpoints: {
            generate: '/api/generate',
            tags: '/api/tags',
            chat: '/api/chat'
        }
    },
    
    // Configuración de proveedores de API
    providers: {
        openai: {
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            models: [
                'gpt-4',
                'gpt-4-turbo-preview',
                'gpt-3.5-turbo',
                'gpt-3.5-turbo-16k'
            ]
        },
        anthropic: {
            name: 'Anthropic',
            baseUrl: 'https://api.anthropic.com/v1',
            models: [
                'claude-3-opus-20240229',
                'claude-3-sonnet-20240229',
                'claude-3-haiku-20240307',
                'claude-instant-1.2'
            ]
        },
        groq: {
            name: 'Groq',
            baseUrl: 'https://api.groq.com/openai/v1',
            models: [
                'llama3-70b-8192',
                'llama3-8b-8192',
                'mixtral-8x7b-32768',
                'gemma-7b-it'
            ]
        }
    },
    
    // Configuración por defecto
    defaults: {
        provider: 'ollama',
        model: 'llama3.2',
        temperature: 0.7,
        maxTokens: 2048
    },
    
    // Configuración de almacenamiento local
    storage: {
        keys: {
            settings: 'promptly_settings',
            chatHistory: 'promptly_chat_history',
            apiKeys: 'promptly_api_keys'
        }
    },
    
    // Configuración de UI
    ui: {
        maxChatHistory: 100,
        typingAnimationDelay: 20,
        autoScrollThreshold: 100
    }
};

// Utilitades globales
const Utils = {
    // Guardar en localStorage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    },
    
    // Cargar de localStorage
    loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error cargando de localStorage:', error);
            return defaultValue;
        }
    },
    
    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Formatear timestamp
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Validar URL
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Escapar HTML
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    },
    
    // Convertir markdown básico a HTML
    markdownToHtml(text) {
        // Procesar bloques de código con sintaxis específica
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            const lang = language || 'text';
            const trimmedCode = code.trim();
            return `<div class="code-block">
                <div class="code-header">
                    <span class="code-language">${lang}</span>
                    <button class="copy-code-btn" onclick="copyCodeBlock(this)">
                        <span class="material-icons">content_copy</span>
                    </button>
                </div>
                <pre><code class="language-${lang}">${this.escapeHtml(trimmedCode)}</code></pre>
            </div>`;
        });
        
        // Procesar otros elementos markdown
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
            .replace(/\n/g, '<br>');
    }
};

// Función global para copiar bloques de código
window.copyCodeBlock = async function(button) {
    const codeBlock = button.closest('.code-block');
    const codeElement = codeBlock.querySelector('code');
    const codeText = codeElement.textContent;
    
    try {
        await navigator.clipboard.writeText(codeText);
        
        // Feedback visual
        const originalIcon = button.innerHTML;
        button.innerHTML = '<span class="material-icons">check</span>';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('copied');
        }, 2000);
        
        // Notificación
        if (window.Swal) {
            window.Swal.fire({
                icon: 'success',
                title: 'Código copiado',
                text: 'El código se ha copiado al portapapeles',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        }
    } catch (error) {
        console.error('Error al copiar código:', error);
        if (window.Swal) {
            window.Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo copiar el código',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
};

// Manejo de errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada:', event.reason);
});

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, Utils };
}