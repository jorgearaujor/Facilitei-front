import axios from 'axios';

// Cria a instância do Axios
export const api = axios.create({
  // No Docker, o Nginx encaminha /api para o container do Spring Boot.
  // A URL relativa tambem mantem front e API na mesma origem no navegador.
  baseURL: '/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfRequest: Promise<void> | null = null;

export const isOptionalAuthEndpointUnavailable = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  return [404, 405, 500].includes(error.response?.status || 0);
};

export const ensureCsrfToken = (): Promise<void> => {
  if (!csrfRequest) {
    const request = api
      .get('/auth/csrf')
      .then(() => undefined)
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
