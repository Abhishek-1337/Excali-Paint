import axios from "axios";

const API_URL = 'http://localhost:3001/';

export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

apiClient.interceptors.response.use(
    request => request,
    async (error) => {
        console.log(error);

        const originalRequest = error.config;
        originalRequest._retry = false;
        if(error.response.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;
           try {
             const res = await apiClient.get("refresh");
             localStorage.setItem("access_token", res.data.token);
             return apiClient(originalRequest);
           }
           catch(ex) {
            localStorage.removeItem("access_token");       
           }
        }
        return Promise.reject(error);
    }
)

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