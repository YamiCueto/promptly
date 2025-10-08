// Clase para manejar el chat
class ChatManager {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.elements = {
            messagesContainer: null,
            messageInput: null,
            sendButton: null,
            welcomeMessage: null
        };
        
        this.init();
    }
    
    init() {
        // Obtener elementos del DOM
        this.elements.messagesContainer = document.getElementById('chatMessages');
        this.elements.messageInput = document.getElementById('messageInput');
        this.elements.sendButton = document.getElementById('sendBtn');
        this.elements.welcomeMessage = this.elements.messagesContainer?.querySelector('.welcome-message');
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar historial guardado
        this.loadChatHistory();
    }
    
    setupEventListeners() {
        // Input de mensaje
        if (this.elements.messageInput) {
            this.elements.messageInput.addEventListener('input', () => {
                this.handleInputChange();
                this.autoResize();
            });
            
            this.elements.messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Botón de enviar
        if (this.elements.sendButton) {
            this.elements.sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        // Escuchar chunks de Ollama para streaming
        window.addEventListener('ollamaChunk', (event) => {
            this.handleStreamingChunk(event.detail);
        });
    }
    
    handleInputChange() {
        const message = this.elements.messageInput.value.trim();
        const hasMessage = message.length > 0;
        const isConfigured = window.appManager?.isConfigured() || false;
        
        this.elements.sendButton.disabled = !hasMessage || !isConfigured || this.isTyping;
    }
    
    autoResize() {
        const textarea = this.elements.messageInput;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        }
    }
    
    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Limpiar input
        this.elements.messageInput.value = '';
        this.autoResize();
        this.handleInputChange();
        
        // Ocultar mensaje de bienvenida
        this.hideWelcomeMessage();
        
        // Agregar mensaje del usuario
        this.addMessage('user', message);
        
        // Mostrar estado de typing
        this.setTyping(true);
        
        try {
            // Obtener configuración actual
            const settings = window.appManager?.getCurrentSettings() || {};
            
            // Enviar mensaje al proveedor
            const response = await aiProviders.sendMessage(message, settings);
            
            if (response.success) {
                this.addMessage('assistant', response.response, {
                    model: response.model,
                    usage: response.usage
                });
            } else {
                this.addMessage('assistant', `Error: ${response.error}`, {
                    isError: true
                });
                // Mostrar notificación de error con SweetAlert2
                if (window.appManager) {
                    window.appManager.showNotification(`Error de conexión: ${response.error}`, 'error');
                }
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.addMessage('assistant', `Error inesperado: ${error.message}`, {
                isError: true
            });
            // Mostrar notificación de error inesperado
            if (window.appManager) {
                window.appManager.showNotification('Error inesperado al enviar mensaje', 'error');
            }
        }
        
        this.setTyping(false);
        this.saveChatHistory();
    }
    
    addMessage(role, content, meta = {}) {
        const messageId = Utils.generateId();
        const timestamp = Date.now();
        
        const messageData = {
            id: messageId,
            role,
            content,
            timestamp,
            meta
        };
        
        this.messages.push(messageData);
        this.renderMessage(messageData);
        this.scrollToBottom();
        
        // Limitar historial
        if (this.messages.length > CONFIG.ui.maxChatHistory) {
            this.messages = this.messages.slice(-CONFIG.ui.maxChatHistory);
        }
    }
    
    renderMessage(messageData) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageData.role}`;
        messageElement.setAttribute('data-message-id', messageData.id);
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        
        if (messageData.meta.isError) {
            contentElement.classList.add('error');
        }
        
        // Procesar contenido
        const processedContent = this.processMessageContent(messageData.content);
        contentElement.innerHTML = processedContent;
        
        // Agregar botón de copiar para mensajes del asistente
        if (messageData.role === 'assistant') {
            const actionsElement = document.createElement('div');
            actionsElement.className = 'message-actions';
            
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '<span class="material-icons">content_copy</span>';
            copyButton.title = 'Copiar respuesta';
            copyButton.addEventListener('click', () => this.copyMessage(messageData.content));
            
            actionsElement.appendChild(copyButton);
            contentElement.appendChild(actionsElement);
        }
        
        const metaElement = document.createElement('div');
        metaElement.className = 'message-meta';
        metaElement.textContent = this.formatMessageMeta(messageData);
        
        messageElement.appendChild(contentElement);
        messageElement.appendChild(metaElement);
        
        this.elements.messagesContainer.appendChild(messageElement);
        
        // Animación de entrada
        setTimeout(() => {
            messageElement.classList.add('animate-in');
        }, 10);
    }
    
    processMessageContent(content) {
        // Escapar HTML y convertir markdown básico
        const escaped = Utils.escapeHtml(content);
        return Utils.markdownToHtml(escaped);
    }
    
    formatMessageMeta(messageData) {
        const time = Utils.formatTime(messageData.timestamp);
        let meta = time;
        
        if (messageData.meta.model) {
            meta += ` • ${messageData.meta.model}`;
        }
        
        if (messageData.meta.usage) {
            const usage = messageData.meta.usage;
            if (usage.total_tokens) {
                meta += ` • ${usage.total_tokens} tokens`;
            }
        }
        
        return meta;
    }
    
    handleStreamingChunk(detail) {
        // Implementar streaming para Ollama
        const lastMessage = this.messages[this.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.streaming) {
            const messageElement = document.querySelector(`[data-message-id="${lastMessage.id}"] .message-content`);
            if (messageElement) {
                const processedContent = this.processMessageContent(detail.full);
                messageElement.innerHTML = processedContent;
                this.scrollToBottom();
            }
        }
    }
    
    setTyping(isTyping) {
        this.isTyping = isTyping;
        this.handleInputChange();
        
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            if (isTyping) {
                loadingOverlay.classList.remove('hidden');
            } else {
                loadingOverlay.classList.add('hidden');
            }
        }
    }
    
    hideWelcomeMessage() {
        if (this.elements.welcomeMessage) {
            this.elements.welcomeMessage.style.display = 'none';
        }
    }
    
    clearChat() {
        this.messages = [];
        
        // Limpiar mensajes del DOM
        const messageElements = this.elements.messagesContainer.querySelectorAll('.message');
        messageElements.forEach(element => element.remove());
        
        // Mostrar mensaje de bienvenida
        if (this.elements.welcomeMessage) {
            this.elements.welcomeMessage.style.display = 'flex';
        }
        
        // Limpiar almacenamiento
        Utils.saveToStorage(CONFIG.storage.keys.chatHistory, []);
    }
    
    scrollToBottom() {
        const container = this.elements.messagesContainer;
        if (container) {
            const shouldScroll = container.scrollTop + container.clientHeight >= 
                                container.scrollHeight - CONFIG.ui.autoScrollThreshold;
            
            if (shouldScroll) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }
    
    loadChatHistory() {
        const savedMessages = Utils.loadFromStorage(CONFIG.storage.keys.chatHistory, []);
        
        if (savedMessages.length > 0) {
            this.hideWelcomeMessage();
            savedMessages.forEach(messageData => {
                this.messages.push(messageData);
                this.renderMessage(messageData);
            });
            this.scrollToBottom();
        }
    }
    
    saveChatHistory() {
        Utils.saveToStorage(CONFIG.storage.keys.chatHistory, this.messages);
    }
    
    exportChat() {
        const chatText = this.messages.map(msg => {
            const role = msg.role === 'user' ? 'Usuario' : 'Asistente';
            const time = new Date(msg.timestamp).toLocaleString('es-ES');
            return `[${time}] ${role}: ${msg.content}`;
        }).join('\n\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    async copyMessage(content) {
        try {
            // Limpiar el contenido HTML para obtener solo texto
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            
            await navigator.clipboard.writeText(textContent);
            
            // Mostrar notificación usando SweetAlert2
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'success',
                    title: 'Copiado',
                    text: 'Respuesta copiada al portapapeles',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            console.error('Error al copiar:', error);
            
            // Fallback para navegadores que no soportan clipboard API
            this.fallbackCopyMessage(content);
        }
    }
    
    fallbackCopyMessage(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        const textArea = document.createElement('textarea');
        textArea.value = textContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'success',
                    title: 'Copiado',
                    text: 'Respuesta copiada al portapapeles',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            console.error('Error en fallback copy:', error);
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo copiar el texto',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// Crear instancia global
const chatManager = new ChatManager();