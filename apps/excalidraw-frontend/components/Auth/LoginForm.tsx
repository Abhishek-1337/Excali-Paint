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

        console.log(isAuthenticated);

        useEffect(() => {
          if (isAuthenticated) {
            router.replace("/canvas/1");
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
                className={`py-2 px-8 outline-1  rounded-lg min-w-full mt-2 text-sm ${errors.username ? "outline-red-500": "outline-gray-800" } active:bg-blue-200`}
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
                type={eyePassword ? "password": "text"}
                name="password" 
                value={form.password}
                placeholder="Enter password" 
                className={`py-2 px-8 outline-1 rounded-lg min-w-full mt-2 text-sm ${errors.password ? "outline-red-500": "outline-gray-800" }`}
                onChange = {(e) => handleSetPassword(e)}
                />
                {
                    !eyePassword ? (
                    <EyeIcon 
                    className="absolute top-10 right-1 cursor-pointer text-gray-500 h-4"
                    onClick={() => setEyePassword(prev => !prev)}
                    />
                    ):
                    <EyeOffIcon 
                    className="absolute top-10 right-1 cursor-pointer text-gray-500 h-4"
                    onClick={() => setEyePassword(prev => !prev)}
                    />
                }
                {
                    errors.password && <p className="absolute text-red-600 text-xs pt-1">{errors.password}</p>
                }
            </div>
            <button 
            className="px-6 py-2 rounded-full transition-all duration-200 font-medium bg-blue-600 text-white cursor-pointer mt-4 text-md hover:outline-gray-300 hover:outline-4"
            onClick={() => handleSubmit()}
            >
                Login
            </button>
            <p className="text-sm">Not have an account ? 
                <Link href="/register" className="text-blue-500 hover:text-blue-400">{" "}Register</Link>
            </p>
        </>
    );
}

export default LoginForm;