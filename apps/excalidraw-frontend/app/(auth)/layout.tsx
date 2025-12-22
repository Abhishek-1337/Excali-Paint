import { ReactNode } from "react";

const Form = ({children}: {children: ReactNode}) => {
    return (
        <div className="mx-auto border-2 border-gray-200 rounded-2xl p-10 bg-gray-50 shadow-2xl absolute -translate-x-[50%] -translate-y-[50%] top-[50%] left-[50%]">
                <div className="bg-white w-full rounded-xl p-12 flex flex-col gap-6 justify-center relative border border-gray-200">
                    {children}
                </div>
        </div>
    );
}

export default Form;