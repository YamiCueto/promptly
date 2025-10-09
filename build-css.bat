@echo off
REM Script para combinar todos los módulos CSS en un solo archivo

echo 🔨 Combinando modulos CSS...

REM Crear el archivo combinado con header
echo /* ======================================== > css\styles-combined.css
echo    PROMPTLY - CSS COMPILADO >> css\styles-combined.css
echo    Generado automaticamente desde modulos >> css\styles-combined.css
echo    ======================================== */ >> css\styles-combined.css
echo. >> css\styles-combined.css

REM Concatenar todos los módulos en orden
echo 📁 Agregando variables.css...
type css\components\variables.css >> css\styles-combined.css
echo. >> css\styles-combined.css

echo 📁 Agregando base.css...
type css\components\base.css >> css\styles-combined.css
echo. >> css\styles-combined.css

echo 📁 Agregando layout.css...
type css\components\layout.css >> css\styles-combined.css
echo. >> css\styles-combined.css

echo 📁 Agregando header.css...
type css\components\header.css >> css\styles-combined.css
echo. >> css\styles-combined.css

echo 📁 Agregando buttons.css...
type css\components\buttons.css >> css\styles-combined.css
echo. >> css\styles-combined.css

echo 📁 Agregando forms.css...
type css\components\forms.css >> css\styles-combined.css
echo. >> css\styles-combined.css

echo 📁 Agregando chat.css...
type css\components\chat.css >> css\styles-combined.css
echo. >> css\styles-combined.css

echo ✅ CSS combinado generado: css\styles-combined.css
echo 📊 Verificando archivo...
if exist css\styles-combined.css (
    echo ✅ Archivo creado exitosamente
) else (
    echo ❌ Error al crear el archivo
)

pause