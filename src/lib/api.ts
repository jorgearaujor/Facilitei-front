import axios from 'axios';

// Em produção (front no Vercel + API no Render) a API fica em outra origem,
// entao definimos a URL absoluta por variavel de ambiente. Em desenvolvimento
// a variavel fica vazia e o proxy do Vite (ou o Nginx no Docker) encaminha /api.
const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) || '/api';

// Cria a instância do Axios
export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfRequest: Promise<void> | null = null;
// Cross-origin: o cookie XSRF-TOKEN pertence ao dominio da API e nao pode ser
// lido via document.cookie no dominio do front. Por isso guardamos o token
// retornado no corpo de /auth/csrf e o enviamos manualmente no cabecalho.
let csrfToken: string | null = null;
let csrfHeaderName = 'X-XSRF-TOKEN';

export const getCsrfToken = (): string | null => csrfToken;
export const getCsrfHeaderName = (): string => csrfHeaderName;

export const isOptionalAuthEndpointUnavailable = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  return [404, 405, 500].includes(error.response?.status || 0);
};

export const ensureCsrfToken = (): Promise<void> => {
  if (!csrfRequest) {
    const request = api
      .get<{ headerName: string; token: string }>('/auth/csrf')
      .then((response) => {
        csrfToken = response.data.token;
        csrfHeaderName = response.data.headerName || csrfHeaderName;
        api.defaults.headers.common[csrfHeaderName] = csrfToken;
      })
      .catch((error) => {
        csrfRequest = null;
        throw error;
      });
    csrfRequest = request;
  }
  return csrfRequest;
};

export const refreshCsrfToken = async (): Promise<void> => {
  csrfRequest = null;
  csrfToken = null;
  delete api.defaults.headers.common[csrfHeaderName];
  await ensureCsrfToken();
};

// Interceptador para tratamento de erros global (logs)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição API:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// Helpers para requisições mais limpas nos componentes
export const get = <T>(url: string, params?: Record<string, unknown>) =>
  api.get<T>(url, { params }).then(res => res.data);

export const post = <T>(url: string, body: unknown) =>
  api.post<T>(url, body).then(res => res.data);

export const put = <T>(url: string, body: unknown) =>
  api.put<T>(url, body).then(res => res.data);

export const patch = <T>(url: string, body: unknown) =>
  api.patch<T>(url, body).then(res => res.data);

export const del = <T>(url: string) => 
  api.delete<T>(url).then(res => res.data);

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  // 'file' deve ser igual ao @RequestParam("file") do seu Java Controller
  formData.append('file', file); 

  const response = await api.post<{ url: string }>('/arquivos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};
