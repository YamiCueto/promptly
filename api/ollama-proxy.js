// api/ollama-proxy.js - Vercel Edge Function
export default async function handler(request) {
  // Solo permitir POST desde tu dominio
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://yamicueto.github.io',
    'https://promptly.vercel.app', // Si también despliegas en Vercel
    'http://localhost:8000' // Para desarrollo
  ];

  if (!allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Headers CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extraer configuración del usuario
    const { endpoint, ...requestData } = await request.json();
    
    // Validar que sea localhost del usuario
    if (!endpoint.startsWith('http://localhost:')) {
      return new Response('Invalid endpoint', { status: 400 });
    }

    // Proxy request a Ollama local del usuario
    const ollamaResponse = await fetch(endpoint, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await ollamaResponse.text();

    return new Response(data, {
      status: ollamaResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Proxy error', 
      message: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}