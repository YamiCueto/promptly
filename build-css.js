const fs = require('fs');
const path = require('path');

console.log('🔨 Combinando módulos CSS...');

// Orden de los módulos CSS
const cssModules = [
    'components/variables.css',
    'components/base.css', 
    'components/layout.css',
    'components/header.css',
    'components/buttons.css',
    'components/forms.css',
    'components/chat.css'
];

// Header del archivo combinado
let combinedCSS = `/* ========================================
   PROMPTLY - CSS COMPILADO
   Generado automáticamente desde módulos
   Fecha: ${new Date().toISOString()}
   ======================================== */

`;

// Combinar todos los módulos
cssModules.forEach(module => {
    const modulePath = path.join(__dirname, 'css', module);
    
    if (fs.existsSync(modulePath)) {
        console.log(`📁 Agregando ${module}...`);
        const moduleContent = fs.readFileSync(modulePath, 'utf8');
        combinedCSS += `\n/* ${module} */\n`;
        combinedCSS += moduleContent;
        combinedCSS += '\n\n';
    } else {
        console.warn(`⚠️  No se encontró: ${module}`);
    }
});

// Escribir archivo combinado
const outputPath = path.join(__dirname, 'css', 'styles-combined.css');
fs.writeFileSync(outputPath, combinedCSS);

console.log('✅ CSS combinado generado: css/styles-combined.css');
console.log(`📏 Tamaño: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
console.log(`📄 Líneas: ${combinedCSS.split('\n').length}`);

// Opcional: Minificar (básico)
const minified = combinedCSS
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentarios
    .replace(/\s+/g, ' ') // Colapsar espacios
    .replace(/;\s*}/g, '}') // Remover ; antes de }
    .trim();

const minifiedPath = path.join(__dirname, 'css', 'styles-combined.min.css');
fs.writeFileSync(minifiedPath, minified);

console.log('✅ CSS minificado generado: css/styles-combined.min.css');
console.log(`📏 Tamaño minificado: ${(fs.statSync(minifiedPath).size / 1024).toFixed(2)} KB`);
console.log(`💾 Reducción: ${((1 - minified.length / combinedCSS.length) * 100).toFixed(1)}%`);