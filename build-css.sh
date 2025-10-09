#!/bin/bash
# Script para combinar todos los módulos CSS en un solo archivo

echo "🔨 Combinando módulos CSS..."

# Crear el archivo combinado
cat > css/styles-combined.css << 'EOF'
/* ========================================
   PROMPTLY - CSS COMPILADO
   Generado automáticamente desde módulos
   ======================================== */

EOF

# Concatenar todos los módulos en orden
echo "📁 Agregando variables.css..."
cat css/components/variables.css >> css/styles-combined.css
echo "" >> css/styles-combined.css

echo "📁 Agregando base.css..."
cat css/components/base.css >> css/styles-combined.css
echo "" >> css/styles-combined.css

echo "📁 Agregando layout.css..."
cat css/components/layout.css >> css/styles-combined.css
echo "" >> css/styles-combined.css

echo "📁 Agregando header.css..."
cat css/components/header.css >> css/styles-combined.css
echo "" >> css/styles-combined.css

echo "📁 Agregando buttons.css..."
cat css/components/buttons.css >> css/styles-combined.css
echo "" >> css/styles-combined.css

echo "📁 Agregando forms.css..."
cat css/components/forms.css >> css/styles-combined.css
echo "" >> css/styles-combined.css

echo "📁 Agregando chat.css..."
cat css/components/chat.css >> css/styles-combined.css
echo "" >> css/styles-combined.css

echo "✅ CSS combinado generado: css/styles-combined.css"
echo "📏 Líneas totales: $(wc -l < css/styles-combined.css)"