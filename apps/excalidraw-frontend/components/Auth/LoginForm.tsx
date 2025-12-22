"use client";

import { LoginUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Form = {
    username: string;
    password: string;
}

type Error = {
    username?: string;
    password?: string;
}

const INITIAL_DATA = {
    username: "",
    password: ""
}

const LoginForm = () => {
    const [form, setForm] = useState<Form>(INITIAL_DATA);
        const [errors, setErrors] = useState<Error>({});
        const router = useRouter();
    
        const validateErrors = () => {
            if(!form.username.trim()) {
                errors.username = "Username can't be empty.";
            }
            else if(form.username.length < 3) {
                errors.username = "Username should have atleast 3 characters.";
            }
    
            if(!form.password.trim()) {
                errors.password = "Password can't be empty";
            }
            else if(form.password.length < 8 ) {
                errors.password = "Password should be atleast 8 character long.";
            }
    
            return errors;
        }

        const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => {
                return {
                    ...prev,
                    username: e.target.value
                }
            });

            setErrors((prev) => {
                const newObj = {...prev};
                delete newObj["username"];
                return newObj;
            });
        }
        
        const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => {
                return {
                    ...prev,
                    password: e.target.value
                }
            });
            setErrors((prev) => {
                const newObj = {...prev};
                delete newObj["password"];
                return newObj;
            });
        }
        const handleSubmit = async () => {
            const errors = validateErrors();
            if(Object.keys(errors).length > 0) {
                console.log(errors);
                setErrors(prev => {
                    return {
                        ...prev,
                        ...errors
                    }
                });
                return;
            }

            try{
                const res = await LoginUser(form);
                localStorage.setItem("token", res.token);
                router.push("/");
                setForm(INITIAL_DATA);
                router.replace("/canvas/1");
            }
            catch(ex){
                console.log(ex);
            }
            finally{
            }
        }
    return (
        <>
            <h2 className="text-center font-semibold tracking-wide text-lg">Excalipaint</h2>
            <div className="relative">
                <label className="mr-4 text-sm font-semibold text-gray-600">
                    Username 
                </label>
                <input 
                type="text" 
                name="username" 
                placeholder="Enter username" 
                value={form.username}
                className={`py-2 px-3 outline-1  rounded-lg min-w-full mt-2 text-sm pb-3 ${errors.username ? "outline-red-500": "outline-gray-800" } active:bg-blue-200`}
                onChange = {(e) => handleSetUsername(e)}
                />
                {
                    errors.username && <p className="absolute text-red-600 text-xs pt-1">{errors.username}</p>
                }
            </div>
            <div className="relative">
                <label className="mr-4 text-sm font-semibold text-gray-600">
                    Password 
                </label>
                <input 
                type="password" 
                name="password" 
                value={form.password}
                placeholder="Enter password" 
                className={`py-2 px-3 outline-1 rounded-lg min-w-full mt-2 text-sm ${errors.password ? "outline-red-500": "outline-gray-800" }`}
                onChange = {(e) => handleSetPassword(e)}
                />
                {
                    errors.password && <p className="absolute text-red-600 text-xs pt-1">{errors.password}</p>
                }
            </div>
            <button 
            className="px-6 py-2 rounded-lg transition-all duration-200 font-medium bg-blue-600 text-white cursor-pointer mt-4 text-md"
            onClick={() => handleSubmit()}
            >
                Login
            </button>
        </>
    );
}

export default LoginForm;