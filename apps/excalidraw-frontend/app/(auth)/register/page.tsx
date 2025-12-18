import Link from "next/link";

const Register = () => {
    return (
        <>
            <div className="mx-auto border-2 border-gray-200 rounded-2xl p-10 bg-gray-50 shadow-2xl absolute -translate-x-[50%] -translate-y-[50%] top-[50%] left-[50%]">
                <div className="bg-white w-full rounded-xl p-12 flex flex-col gap-6 justify-center relative border border-gray-200">
                    <div>
                        <label className="mr-4 text-sm font-semibold text-gray-600">
                            Username 
                        </label>
                        <input type="text" name="username" placeholder="Enter username" className="py-2 px-3 outline-1 outline-gray-800 rounded-lg min-w-full mt-2 text-md"/>
                    </div>
                    <div>
                        <label className="mr-4 text-sm font-semibold text-gray-600">
                            E-mail 
                        </label>
                        <input type="text" name="mail" placeholder="Enter mail" className="py-2 px-3 outline-1 outline-gray-800 rounded-lg min-w-full mt-2 text-md"/>
                    </div>
                    <div>
                        <label className="mr-4 text-sm font-semibold text-gray-600">
                            Password 
                        </label>
                        <input type="password" name="password" placeholder="Enter password" className="py-2 px-3 outline-1 outline-gray-800 rounded-lg min-w-full mt-2 text-md"/>
                    </div>
                    <button className="px-6 py-2 rounded-lg transition-all duration-200 font-medium bg-blue-600 text-white cursor-pointer mt-4 text-md">
                      Register
                    </button>
                    <p className="text-sm">Already have account? <Link href="/login" className="text-blue-500 hover:text-blue-400">Login</Link></p>
                </div>
              </div>
        </>
    )
}

export default Register;