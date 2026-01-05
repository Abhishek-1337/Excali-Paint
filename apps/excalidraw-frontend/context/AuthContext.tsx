"use client";

import {  LoginUser, logoutUser, RefreshMe, RegisterUser } from "@/lib/api";
import { Form } from "@/types/types";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

type loginData = { username: string, password: string};

export const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    register: (data: Form) => {},
    login: (data: loginData) => {},
    logout: () => {}
});

const AuthProvider = ({children} : {children: ReactNode}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function initAuth() {
            try {
                const res = await RefreshMe();
                const token = localStorage.getItem("access_token");
                setUser({
                    ...res.user,
                    token
                });

            }
            catch(ex) {
                console.log(ex);
            }
        }

        initAuth();
    }, []);

    console.log(user);

    const register = async (form: Form) => {
        try{
            const res = await RegisterUser(form);
            console.log(res);
            setUser(res);
            localStorage.setItem("access_token", res.token);
            setIsAuthenticated(true);
            router.replace("/canvas/1");
        }
        catch(ex){
            console.log(ex);
        }
        finally{
        }
    }

    const login = async (data: loginData)=> {
        try{
            const reqData = {
                name: data.username,
                password: data.password
            }
            const res = await LoginUser(reqData);
            console.log(res);
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
            await logoutUser();
            localStorage.removeItem("access_token");
            router.replace("/login");
        }
        catch(ex) {
            console.log(ex);
        }
    }

    const value = useMemo(() => {
        return {
            user,
            isAuthenticated,
            register,
            login,
            logout
        }
    }, [user]);
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;