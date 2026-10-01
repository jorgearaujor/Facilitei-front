// URL base da API. Configure via VITE_API_BASE_URL (.env / painel de deploy).
// Sem barra final. Fallback para a API publicada no Render.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'https://facilitei-api.onrender.com'
).replace(/\/$/, '');

// Deriva a URL do WebSocket (ws/wss) a partir da URL base da API.
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');
