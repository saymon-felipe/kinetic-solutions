import axios from 'axios';
import i18n from '../i18n';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.resolvedLanguage || 'pt-BR';
  return config;
});

export default api;
