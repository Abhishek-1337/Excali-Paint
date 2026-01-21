import axios from "axios";

const API_URL = 'http://localhost:3001/';

export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const processQueue = (token: string) => {
  refreshQueue.forEach(cb => cb(token));
  refreshQueue = [];
};

apiClient.interceptors.request.use(request => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  response => response,

  async error => {

    const originalRequest = error.config;
    const { status, data } = error.response;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise(resolve => {
        refreshQueue.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await apiClient.get("refresh");

      const newToken = res.data.token;
      localStorage.setItem("access_token", newToken);

      processQueue(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);

    } catch (refreshError) {
      localStorage.removeItem("access_token");
      // window.location.href = "/login";
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);


export const RegisterUser = async (data: { username: string, email: string, password: string}) => {
    const reqData = {
        name: data.username,
        email: data.email,
        password: data.password
    }
    const res = await apiClient.post("signup", reqData);
    return res.data;
}

export const LoginUser = async (data: { name: string, password: string}) => {
    const res = await apiClient.post("signin", data);
    return res.data;
}

export const logoutUser = async () => {
    const res = await apiClient.post("logout");
    return res.data;
}

export const RefreshMe = async () => {
    const res = await apiClient.get("auth/me");
    return res.data;
}

export const createRoom = async (slug: string) => {
  const res = await apiClient.post("create-room", {slug});
  return res.data;
}

export const getRoom = async (slug: string) => {
  const res = await apiClient.get(`room/${slug}`);
  return res.data;
}