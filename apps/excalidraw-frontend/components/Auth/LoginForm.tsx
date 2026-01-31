"use client";

import useAuthContext from "@/hooks/useAuthContext";
import { EyeIcon, EyeOffIcon} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        const [eyePassword, setEyePassword] = useState(true);
        const router = useRouter();
        const { login, isAuthenticated } = useAuthContext();

        useEffect(() => {
          if (isAuthenticated) {
            router.replace("/canvas");
          }
        }, [isAuthenticated]);

    
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
                login(form);
                // const res = await LoginUser(form);
                // localStorage.setItem("token", res.token);
                setForm(INITIAL_DATA);
            }
            catch(ex){
                console.log(ex);
            }
            finally{
            }
        }
    return (
        <div className="flex flex-col gap-5 w-xs">
            <h2 className="text-center font-bold tracking-wide text-2xl text-gray-800 mb-2">Excalipaint</h2>
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username 
                </label>
                <input 
                type="text" 
                name="username" 
                placeholder="Enter username" 
                value={form.username}
                className={`py-2.5 px-4 rounded-lg w-full text-sm border-2 transition-all duration-200 ${
                    errors.username 
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                } outline-none`}
                onChange = {(e) => handleSetUsername(e)}
                />
                {
                    errors.username && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors.username}
                        </p>
                    )
                }
            </div>
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password 
                </label>
                <div className="relative">
                    <input 
                    type={eyePassword ? "password": "text"}
                    name="password" 
                    value={form.password}
                    placeholder="Enter password" 
                    className={`py-2.5 px-4 pr-10 rounded-lg w-full text-sm border-2 transition-all duration-200 ${
                        errors.password 
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    } outline-none`}
                    onChange = {(e) => handleSetPassword(e)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setEyePassword(prev => !prev)}
                        aria-label={eyePassword ? "Show password" : "Hide password"}
                    >
                        {!eyePassword ? (
                            <EyeIcon className="h-5 w-5" />
                        ) : (
                            <EyeOffIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {
                    errors.password && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors.password}
                        </p>
                    )
                }
            </div>
            <button 
            className="w-full py-2.5 rounded-lg transition-all duration-200 font-semibold bg-blue-600 text-white cursor-pointer mt-2 text-sm hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
            onClick={() => handleSubmit()}
            >
                Sign In
            </button>
            <p className="text-sm text-gray-600 text-center">
                Don't have an account? <Link href="/register" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">Sign up</Link>
            </p>
        </div>
    );
}

export default LoginForm;