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
    logout: () => {},
    loading: false
});

const AuthProvider = ({children} : {children: ReactNode}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        async function initAuth() {
            setLoading(true);
            try {
                const res = await RefreshMe();
                const token = localStorage.getItem("access_token");
                setUser({
                    ...res.user,
                    token
                });
                setLoading(false);

            }
            catch(ex) {
                console.log(ex);
            }
        }

        initAuth();
    }, []);

    const register = async (form: Form) => {
        setLoading(true);
        try{
            const res = await RegisterUser(form);
            setUser(res);
            localStorage.setItem("access_token", res.token);
            setIsAuthenticated(true);
            router.replace("/canvas/1");
            setLoading(false);
        }
        catch(ex){
            console.log(ex);
        }
        finally{
        }
    }

    const login = async (data: loginData)=> {
        setLoading(true);
        try{
            const reqData = {
                name: data.username,
                password: data.password
            }
            const res = await LoginUser(reqData);

            setUser(res);
            localStorage.setItem("access_token", res.token);
            setIsAuthenticated(true);
            setLoading(false);
            router.replace("/canvas/");
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
            logout,
            loading
        }
    }, [user]);
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;