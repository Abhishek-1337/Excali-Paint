import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react"

const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    return ctx;
}

export default useAuthContext;