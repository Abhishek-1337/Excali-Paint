"use client"

import Room from "@/components/Room";
import useAuthContext from "@/hooks/useAuthContext";

const Root = () => {
    const { user } = useAuthContext();
    if(user === null) {
        return (
            <>Some error</>
        )
    }
   
    return (
        //@ts-ignore
        <Room userId = {user.id}/>
    );
};

export default Root;

