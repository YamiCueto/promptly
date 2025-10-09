// js/cors-handler.js - Sistema inteligente de manejo de CORS
class CORSHandler {
    constructor() {
        this.strategies = [
            new DirectConnectionStrategy(),
            new ProxyStrategy(),
            new TunnelStrategy(),
            new FallbackAPIStrategy()
        ];
        this.workingStrategy = null;
    }

    async findWorkingStrategy(testEndpoint = 'http://localhost:11434/api/tags') {
        console.log('🔍 Detectando estrategia CORS funcional...');
        
        for (const strategy of this.strategies) {
            try {
                console.log(`⏳ Probando: ${strategy.name}`);
                const result = await strategy.test(testEndpoint);
                
                if (result.success) {
                    console.log(`✅ Estrategia funcional: ${strategy.name}`);
                    this.workingStrategy = strategy;
                    return strategy;
                }
            } catch (error) {
                console.log(`❌ ${strategy.name}: ${error.message}`);
            }
        }

        throw new Error('❌ No se encontró estrategia CORS funcional');
    }

    async makeRequest(url, options = {}) {
        if (!this.workingStrategy) {
            await this.findWorkingStrategy();
        }

        return this.workingStrategy.request(url, options);
    }
}

// Estrategia 1: Conexión directa (funciona si CORS está configurado)
class DirectConnectionStrategy {
    name = 'Conexión Directa';

    async test(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return { success: response.ok };
    }

    async request(url, options) {
        return fetch(url, options);
    }
}

// Estrategia 2: Proxy backend
class ProxyStrategy {
    name = 'Proxy Backend';
    proxyUrl = 'https://promptly.vercel.app/api/ollama-proxy'; // Tu proxy

    async test(url) {
        const response = await fetch(this.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                endpoint: url,
                method: 'GET'
            })
        });
        return { success: response.ok };
    }

    async request(url, options) {
        return fetch(this.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                endpoint: url,
                method: options.method || 'GET',
                body: options.body,
                headers: options.headers
            })
        });
    }
}

// Estrategia 3: Tunnel público (ngrok, cloudflare tunnel)
class TunnelStrategy {
    name = 'Tunnel Público';

    async test(url) {
        // Intentar detectar si hay un tunnel activo
        const tunnelUrls = await this.detectTunnels();
        
        for (const tunnelUrl of tunnelUrls) {
            try {
                const response = await fetch(`${tunnelUrl}/api/tags`);
                if (response.ok) {
                    this.activeTunnel = tunnelUrl;
                    return { success: true };
                }
            } catch (e) {
                continue;
            }
        }
        return { success: false };
    }

    async detectTunnels() {
        // Buscar tunnels comunes
        const commonPorts = [4040, 8080, 8000]; // Puertos de UI de ngrok
        const tunnels = [];

        for (const port of commonPorts) {
            try {
                const response = await fetch(`http://localhost:${port}/api/tunnels`);
                if (response.ok) {
                    const data = await response.json();
                    tunnels.push(...data.tunnels.map(t => t.public_url));
                }
            } catch (e) {
                // Ignorar errores
            }
        }

        return tunnels;
    }

    async request(url, options) {
        if (!this.activeTunnel) {
            throw new Error('No hay tunnel activo');
        }
        
        const tunnelUrl = url.replace('http://localhost:11434', this.activeTunnel);
        return fetch(tunnelUrl, options);
    }
}

// Estrategia 4: APIs externas como fallback
class FallbackAPIStrategy {
    name = 'APIs Externas (Fallback)';

    async test(url) {
        // Siempre disponible como último recurso
        return { success: true };
    }

    async request(url, options) {
        // Redirigir a OpenAI, Anthropic, etc.
        throw new Error('Implementar APIs externas como fallback');
    }
}

// Export global
window.CORSHandler = CORSHandler;