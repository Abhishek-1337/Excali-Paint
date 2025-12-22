import axios from "axios";

const API_URL = 'http://localhost:3001/';

const apiClient = axios.create({
    baseURL: API_URL
});

apiClient.interceptors.response.use(
    request => request,
    async (error) => {
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

export const LoginUser = async (data: { username: string, password: string}) => {
    const reqData = {
        name: data.username,
        password: data.password
    }
    const res = await apiClient.post("signin", reqData);
    return res.data;
}