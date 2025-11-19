import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export const apiForFiles = axios.create({
  baseURL,
});

apiForFiles.interceptors.request.use((config) => {
  if (config.data && !(config.data instanceof FormData)) {
    const formData = new FormData();
    Object.entries(config.data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    config.data = formData;
  }
  if (config.headers) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

apiForFiles.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export default api;
