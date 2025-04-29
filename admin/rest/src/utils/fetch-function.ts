import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app:8008/mmcp/api/v1',
});
async function getSessionToken() {
  const token = window.sessionStorage.getItem('session');
  if (token) {
    return token;
  }
}
async function getToken() {
  if (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem('session')
  ) {
    const storedSession = window.sessionStorage.getItem('session');
    return storedSession
      ? JSON.parse(storedSession)?.user.accessToken
      : await getSessionToken();
  }
  return null;
}

axiosInstance.interceptors.request.use(async function (config) {
  const token = await getToken();
  console.log('baseurl', process.env.NEXT_PUBLIC_REACT_APP_API_URL);

  if (token && !config.url?.includes('Auth/Login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
