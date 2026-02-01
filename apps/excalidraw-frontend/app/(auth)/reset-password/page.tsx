"use client";

import { resetPassword } from "@/lib/api";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type Form = {
    password: string;
    confirmPassword: string;
}

type Error = {
    password?: string;
    confirmPassword?: string;
}

const INITIAL_DATA: Form = {
    password: "",
    confirmPassword: ""
}

const ResetPasswordPage = () => {
    const [form, setForm] = useState<Form>(INITIAL_DATA);
    const [errors, setErrors] = useState<Error>({});
    const [eyePassword, setEyePassword] = useState(true);
    const [eyeConfirmPassword, setEyeConfirmPassword] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Get reset token from URL

    if(!token) {
        router.push("/forget-password");
    }

    const validateErrors = (): Error => {
        const newErrors: Error = {};

        if (!form.password.trim()) {
            newErrors.password = "Password can't be empty";
        } else if (form.password.length < 8) {
            newErrors.password = "Password should be at least 8 characters long";
        } else if (!/(?=.*[a-z])/.test(form.password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(form.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(form.password)) {
            newErrors.password = "Password must contain at least one number";
        }

        if (!form.confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    }

    const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            password: e.target.value
        }));

        setErrors((prev) => {
            const newObj = { ...prev };
            delete newObj["password"];
            return newObj;
        });
    }

    const handleSetConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            confirmPassword: e.target.value
        }));

        setErrors((prev) => {
            const newObj = { ...prev };
            delete newObj["confirmPassword"];
            return newObj;
        });
    }

    const handleSubmit = async () => {
        if(!token) {
            return;
        }
        const validationErrors = validateErrors();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            // API call to reset password
            const data = await resetPassword({
                token,
                newPassword: form.password,
                confirmPassword: form.confirmPassword
            });
            localStorage.setItem("access_token", data.token);
            
            setIsSuccess(true);
        } catch (ex) {
            console.log(ex);
            setErrors({ password: "Failed to reset password. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Success State
    if (isSuccess) {
        return (
            <div className="flex items-center justify-center px-4">
                <div className="max-w-md w-xs">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Password Reset Successful
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your password has been successfully reset. You can now login with your new password.
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full py-2.5 rounded-lg transition-all duration-200 font-semibold bg-blue-600 text-white cursor-pointer text-sm hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex items-center justify-center px-4">
            <div className="max-w-md w-xs">
                <div className="flex flex-col gap-5">
                    {/* Header */}
                    <div className="text-center mb-2">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-center font-bold tracking-wide text-2xl text-gray-800 mb-2">
                            Reset Password
                        </h2>
                        <p className="text-sm text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={eyePassword ? "password" : "text"}
                                name="password"
                                value={form.password}
                                placeholder="Enter new password"
                                className={`py-2.5 px-4 pr-10 rounded-lg w-full text-sm border-2 transition-all duration-200 ${
                                    errors.password
                                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                } outline-none`}
                                onChange={(e) => handleSetPassword(e)}
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
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                {errors.password}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1.5">
                            Must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={eyeConfirmPassword ? "password" : "text"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                placeholder="Confirm new password"
                                className={`py-2.5 px-4 pr-10 rounded-lg w-full text-sm border-2 transition-all duration-200 ${
                                    errors.confirmPassword
                                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                } outline-none`}
                                onChange={(e) => handleSetConfirmPassword(e)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setEyeConfirmPassword(prev => !prev)}
                                aria-label={eyeConfirmPassword ? "Show password" : "Hide password"}
                            >
                                {!eyeConfirmPassword ? (
                                    <EyeIcon className="h-5 w-5" />
                                ) : (
                                    <EyeOffIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Password Strength Indicator */}
                    {form.password && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                    {form.password.length >= 8 ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                    <span className={form.password.length >= 8 ? "text-green-600" : "text-gray-600"}>
                                        At least 8 characters
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    {/(?=.*[a-z])/.test(form.password) ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                    <span className={/(?=.*[a-z])/.test(form.password) ? "text-green-600" : "text-gray-600"}>
                                        One lowercase letter
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    {/(?=.*[A-Z])/.test(form.password) ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                    <span className={/(?=.*[A-Z])/.test(form.password) ? "text-green-600" : "text-gray-600"}>
                                        One uppercase letter
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    {/(?=.*\d)/.test(form.password) ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                    <span className={/(?=.*\d)/.test(form.password) ? "text-green-600" : "text-gray-600"}>
                                        One number
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        className="w-full py-2.5 rounded-lg transition-all duration-200 font-semibold bg-blue-600 text-white cursor-pointer mt-2 text-sm hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Resetting Password...
                            </span>
                        ) : (
                            "Reset Password"
                        )}
                    </button>

                    {/* Back to Login */}
                    <p className="text-sm text-gray-600 text-center">
                        Remember your password?{" "}
                        <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </Suspense>
        
    );
}

export default ResetPasswordPage;