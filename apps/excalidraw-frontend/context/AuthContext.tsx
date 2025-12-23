"use client"
import {  LoginUser, logoutUser } from "@/lib/api";
import { useRouter } from "next/router";
import { createContext, ReactNode, useState } from "react";

type loginData = { username: string, password: string};

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: (data: loginData) => {},
    logout: () => {}
});

const AuthProvider = ({children} : {children: ReactNode}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const login = async (data: loginData)=> {
        try{
            const reqData = {
                name: data.username,
                password: data.password
            }
            const res = await LoginUser(reqData);
            setUser(res);
            localStorage.setItem("access_token", res.token);
            setIsAuthenticated(true);
        }
        catch(ex) {

            console.log(ex);
        }
    }

    const logout = async () => {
        try {
            const res = await logoutUser();
            localStorage.removeItem("token");
            router.replace("/");
        }
        catch(ex) {

        }
    }
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;