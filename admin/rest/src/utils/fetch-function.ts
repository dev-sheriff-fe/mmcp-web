import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app:8008/mmcp/api/v1',
});
async function getSessionToken() {
  const token = window.localStorage.getItem('token');
  if (token) {
    return token;
  }
}
async function getToken() {
  if (typeof window !== 'undefined' && window.localStorage.getItem('token')) {
    const storedSession = window.localStorage.getItem('token');
    return storedSession ? storedSession : await getSessionToken();
  }
  return null;
}

axiosInstance.interceptors.request.use(async function (config) {
  const token = await getToken();

  if (token && !config.url?.includes('Auth/Login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
