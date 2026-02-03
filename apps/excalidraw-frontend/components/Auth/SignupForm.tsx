"use client";

import useAuthContext from "@/hooks/useAuthContext";
import { RegisterUser } from "@/lib/api";
import { Form } from "@/types/types";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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

const SignupForm = () => {
    const [form, setForm] = useState<Form>(INITIAL_DATA);
    const [errors, setErrors] = useState<Error>({});
    const [eyePassword, setEyePassword] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuthContext();
    
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
            setIsSubmitting(true);
            try{
                register(form);
            }
            catch(ex) {

            }
            finally{
                setIsSubmitting(true);
            }
            
        }

        const handleEyeClick = () => {
            setEyePassword(prev => !prev);
        }
    return (
        <div className="flex flex-col gap-5 w-xs">
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username 
                </label>
                <input 
                type="text" 
                name="username" 
                placeholder="Enter username" 
                value={form.username}
                className={`py-2.5 px-4 rounded-lg min-w-full text-sm border-2 transition-all duration-200 ${
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
                    E-mail 
                </label>
                <input 
                type="email" 
                name="mail" 
                placeholder="Enter email" 
                value={form.email}
                className={`py-2.5 px-4 rounded-lg w-full text-sm border-2 transition-all duration-200 ${
                    errors.email 
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                } outline-none`}
                onChange = {(e) => handleSetEmail(e)}
                />
                {
                    errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors.email}
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
                    type={eyePassword ? "password" : "text"}
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
                        onClick={handleEyeClick}
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
                {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}   
            </button>
            <p className="text-sm text-gray-600 text-center">
                Already have an account? <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">Log in</Link>
            </p>
        </div>
    );
}

export default SignupForm;