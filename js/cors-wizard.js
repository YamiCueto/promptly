// js/cors-wizard.js - Wizard automático para solucionar CORS
class CORSWizard {
    constructor() {
        this.steps = [
            new DetectionStep(),
            new DiagnosisStep(),
            new SolutionStep(),
            new VerificationStep()
        ];
        this.currentStep = 0;
        this.results = {};
    }

    async start() {
        const modal = this.createWizardModal();
        document.body.appendChild(modal);
        
        await this.runSteps();
    }

    createWizardModal() {
        const modal = document.createElement('div');
        modal.className = 'cors-wizard-modal';
        modal.innerHTML = `
            <div class="cors-wizard-content">
                <div class="cors-wizard-header">
                    <h3>🔧 Asistente de Configuración CORS</h3>
                    <div class="cors-wizard-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">Paso 1 de ${this.steps.length}</span>
                    </div>
                </div>
                <div class="cors-wizard-body">
                    <div class="cors-wizard-step-content"></div>
                </div>
                <div class="cors-wizard-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.cors-wizard-modal').remove()">
                        Cancelar
                    </button>
                    <button class="btn btn-primary cors-wizard-next" disabled>
                        Siguiente
                    </button>
                </div>
            </div>
        `;
        return modal;
    }

    async runSteps() {
        for (let i = 0; i < this.steps.length; i++) {
            this.currentStep = i;
            this.updateProgress();
            
            const step = this.steps[i];
            const result = await step.execute(this.results);
            this.results[step.name] = result;
        }
    }

    updateProgress() {
        const progress = ((this.currentStep + 1) / this.steps.length) * 100;
        const modal = document.querySelector('.cors-wizard-modal');
        modal.querySelector('.progress-fill').style.width = `${progress}%`;
        modal.querySelector('.progress-text').textContent = 
            `Paso ${this.currentStep + 1} de ${this.steps.length}`;
    }
}

class DetectionStep {
    name = 'detection';

    async execute(results) {
        const content = document.querySelector('.cors-wizard-step-content');
        content.innerHTML = `
            <h4>🔍 Detectando Configuración</h4>
            <div class="detection-tests">
                <div class="test-item">
                    <span class="test-name">Ollama Local</span>
                    <span class="test-status">⏳ Probando...</span>
                </div>
                <div class="test-item">
                    <span class="test-name">CORS Headers</span>
                    <span class="test-status">⏳ Probando...</span>
                </div>
                <div class="test-item">
                    <span class="test-name">Proxy Disponible</span>
                    <span class="test-status">⏳ Probando...</span>
                </div>
            </div>
        `;

        const tests = [
            { name: 'Ollama Local', test: () => this.testOllamaLocal() },
            { name: 'CORS Headers', test: () => this.testCORSHeaders() },
            { name: 'Proxy Disponible', test: () => this.testProxy() }
        ];

        const results = {};
        
        for (const test of tests) {
            try {
                const result = await test.test();
                results[test.name] = result;
                this.updateTestStatus(test.name, result ? '✅ OK' : '❌ Error');
            } catch (error) {
                results[test.name] = false;
                this.updateTestStatus(test.name, `❌ ${error.message}`);
            }
        }

        return results;
    }

    async testOllamaLocal() {
        try {
            const response = await fetch('http://localhost:11434/api/tags', {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            return response.ok;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('CORS')) {
                return 'cors_error';
            }
            return false;
        }
    }

    async testCORSHeaders() {
        // Test si Ollama tiene CORS configurado
        try {
            const response = await fetch('http://localhost:11434/api/tags', {
                method: 'OPTIONS'
            });
            const corsHeader = response.headers.get('Access-Control-Allow-Origin');
            return corsHeader === '*' || corsHeader === window.location.origin;
        } catch (error) {
            return false;
        }
    }

    async testProxy() {
        try {
            const response = await fetch('/api/ollama-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ test: true })
            });
            return response.status !== 404;
        } catch (error) {
            return false;
        }
    }

    updateTestStatus(testName, status) {
        const testItem = Array.from(document.querySelectorAll('.test-item'))
            .find(item => item.querySelector('.test-name').textContent === testName);
        if (testItem) {
            testItem.querySelector('.test-status').textContent = status;
        }
    }
}

class DiagnosisStep {
    name = 'diagnosis';

    async execute(results) {
        const detection = results.detection;
        
        const content = document.querySelector('.cors-wizard-step-content');
        content.innerHTML = `
            <h4>🔬 Diagnóstico</h4>
            <div class="diagnosis-results">
                ${this.generateDiagnosis(detection)}
            </div>
        `;

        return this.analyzeProblem(detection);
    }

    generateDiagnosis(detection) {
        if (detection['Ollama Local'] === true) {
            return `
                <div class="diagnosis-good">
                    ✅ <strong>Ollama funciona correctamente</strong><br>
                    No necesitas configuración CORS adicional.
                </div>
            `;
        }

        if (detection['Ollama Local'] === 'cors_error') {
            return `
                <div class="diagnosis-warning">
                    ⚠️ <strong>Error de CORS detectado</strong><br>
                    Ollama está funcionando pero bloquea peticiones desde GitHub Pages.<br>
                    Necesitas configurar CORS en Ollama.
                </div>
            `;
        }

        return `
            <div class="diagnosis-error">
                ❌ <strong>Ollama no está disponible</strong><br>
                Verifica que Ollama esté ejecutándose en puerto 11434.
            </div>
        `;
    }

    analyzeProblem(detection) {
        return {
            needsCORS: detection['Ollama Local'] === 'cors_error',
            needsOllama: detection['Ollama Local'] === false,
            hasProxy: detection['Proxy Disponible'] === true
        };
    }
}

class SolutionStep {
    name = 'solution';

    async execute(results) {
        const diagnosis = results.diagnosis;
        
        const content = document.querySelector('.cors-wizard-step-content');
        content.innerHTML = this.generateSolutions(diagnosis);

        return { solutionsOffered: true };
    }

    generateSolutions(diagnosis) {
        if (diagnosis.needsOllama) {
            return `
                <h4>🚀 Solución: Instalar y Configurar Ollama</h4>
                <div class="solution-steps">
                    <ol>
                        <li>Descarga Ollama desde <a href="https://ollama.ai" target="_blank">ollama.ai</a></li>
                        <li>Instala un modelo: <code>ollama pull llama2</code></li>
                        <li>Configura CORS (siguientes pasos)</li>
                    </ol>
                </div>
            `;
        }

        if (diagnosis.needsCORS) {
            return `
                <h4>🔧 Solución: Configurar CORS en Ollama</h4>
                <div class="solution-tabs">
                    <div class="tab-buttons">
                        <button class="tab-btn active" onclick="showTab('windows')">Windows</button>
                        <button class="tab-btn" onclick="showTab('mac')">macOS</button>
                        <button class="tab-btn" onclick="showTab('linux')">Linux</button>
                    </div>
                    <div class="tab-content">
                        <div id="windows-tab" class="tab-pane active">
                            <h5>Para Windows:</h5>
                            <ol>
                                <li>Cierra Ollama completamente</li>
                                <li>Abre CMD como Administrador</li>
                                <li>Ejecuta estos comandos:
                                    <div class="code-block">
                                        <code>setx OLLAMA_ORIGINS "*"</code><br>
                                        <code>setx OLLAMA_HOST "0.0.0.0:11434"</code>
                                    </div>
                                </li>
                                <li>Reinicia tu computadora</li>
                                <li>Inicia Ollama: <code>ollama serve</code></li>
                            </ol>
                            <button class="btn btn-primary" onclick="downloadCORSScript('windows')">
                                💾 Descargar Script Automático
                            </button>
                        </div>
                        <div id="mac-tab" class="tab-pane">
                            <h5>Para macOS:</h5>
                            <ol>
                                <li>Abre Terminal</li>
                                <li>Edita tu perfil: <code>nano ~/.zshrc</code></li>
                                <li>Agrega estas líneas:
                                    <div class="code-block">
                                        <code>export OLLAMA_ORIGINS="*"</code><br>
                                        <code>export OLLAMA_HOST="0.0.0.0:11434"</code>
                                    </div>
                                </li>
                                <li>Guarda y recarga: <code>source ~/.zshrc</code></li>
                                <li>Reinicia Ollama</li>
                            </ol>
                        </div>
                        <div id="linux-tab" class="tab-pane">
                            <h5>Para Linux:</h5>
                            <ol>
                                <li>Edita tu perfil: <code>nano ~/.bashrc</code></li>
                                <li>Agrega estas líneas:
                                    <div class="code-block">
                                        <code>export OLLAMA_ORIGINS="*"</code><br>
                                        <code>export OLLAMA_HOST="0.0.0.0:11434"</code>
                                    </div>
                                </li>
                                <li>Recarga: <code>source ~/.bashrc</code></li>
                                <li>Reinicia Ollama</li>
                            </ol>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <h4>✅ Todo Configurado</h4>
            <p>Tu configuración CORS está funcionando correctamente.</p>
        `;
    }
}

class VerificationStep {
    name = 'verification';

    async execute(results) {
        const content = document.querySelector('.cors-wizard-step-content');
        content.innerHTML = `
            <h4>✅ Verificación Final</h4>
            <div class="verification-tests">
                <button class="btn btn-primary" onclick="rerunCORSTest()">
                    🔄 Probar Configuración
                </button>
                <div class="verification-results" style="margin-top: 20px;"></div>
            </div>
        `;

        return { completed: true };
    }
}

// Funciones globales para el wizard
window.showTab = function(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar pestaña seleccionada
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
};

window.downloadCORSScript = function(platform) {
    if (platform === 'windows') {
        const script = `@echo off
echo 🔧 Configurando CORS para Ollama...
echo.
echo ⏹️ Cerrando Ollama...
taskkill /F /IM ollama.exe 2>nul

echo 🔧 Configurando variables de entorno...
setx OLLAMA_ORIGINS "*"
setx OLLAMA_HOST "0.0.0.0:11434"

echo.
echo ✅ Configuración completada!
echo 📝 IMPORTANTE: Reinicia tu computadora para aplicar los cambios
echo 🚀 Después ejecuta: ollama serve
echo.
pause`;

        const blob = new Blob([script], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'setup-ollama-cors.bat';
        a.click();
        URL.revokeObjectURL(url);
    }
};

window.rerunCORSTest = async function() {
    const resultsDiv = document.querySelector('.verification-results');
    resultsDiv.innerHTML = '⏳ Probando conexión...';

    try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (response.ok) {
            resultsDiv.innerHTML = `
                <div class="success-message">
                    ✅ <strong>¡CORS configurado correctamente!</strong><br>
                    Promptly puede conectarse a Ollama sin problemas.
                </div>
            `;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="error-message">
                ❌ <strong>Error de conexión:</strong> ${error.message}<br>
                Verifica que hayas seguido todos los pasos y reiniciado tu sistema.
            </div>
        `;
    }
};

// Export
window.CORSWizard = CORSWizard;