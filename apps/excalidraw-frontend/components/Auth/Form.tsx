"use client";

import { RegisterUser } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Form = {
    username: string;
    email: string;
    password: string;
}

type Error = {
    username?: string;
    email?: string;
    password?: string;
}

const INITIAL_DATA = {
    username: "",
    email: "",
    password: ""
}

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const Form = () => {
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
            
            if(!form.email.trim()) {
                errors.email = "Email can't be empty";
            }
            else if(!validateEmail(form.email.toLowerCase().trim())) {
                errors.email = "Input valid email";
            }
    
            if(!form.password.trim()) {
                errors.password = "Password can't be empty";
            }
            else if(form.password.length < 8 ) {
                errors.password = "Password should be atleast 8 character long.";
            }
    
            return errors;
        }

        console.log(errors);

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
        const handleSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => {
                return {
                    ...prev,
                    email: e.target.value
                }
            });
            setErrors((prev) => {
                const newObj = {...prev};
                delete newObj["email"];
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

            console.log(form);
            try{
                const res = await RegisterUser(form);
                setForm(INITIAL_DATA);
                router.replace("/canvas");
            }
            catch(ex){
                console.log(ex);
            }
            finally{
            }
        }
    return (
        <div className="mx-auto border-2 border-gray-200 rounded-2xl p-10 bg-gray-50 shadow-2xl absolute -translate-x-[50%] -translate-y-[50%] top-[50%] left-[50%]">
                <div className="bg-white w-full rounded-xl p-12 flex flex-col gap-6 justify-center relative border border-gray-200">
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
                            E-mail 
                        </label>
                        <input 
                        type="text" 
                        name="mail" 
                        placeholder="Enter mail" 
                        value={form.email}
                        className={`py-2 px-3 outline-1 outline-gray-800 rounded-lg min-w-full mt-2 text-md pb-3 text-sm ${errors.email ? "outline-red-500": "outline-gray-800" }`}
                        onChange = {(e) => handleSetEmail(e)}
                        />
                        {
                            errors.email && <p className="absolute text-red-600 text-xs pt-1">{errors.email}</p>
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
                      Register
                    </button>
                    <p className="text-sm">Already have account? <Link href="/login" className="text-blue-500 hover:text-blue-400">Login</Link></p>
                </div>
              </div>
    );
}

export default Form;