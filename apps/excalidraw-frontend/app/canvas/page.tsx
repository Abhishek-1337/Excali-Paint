"use client"

import Room from "@/components/Room";
import useAuthContext from "@/hooks/useAuthContext";

const Root = () => {
    const { user, loading } = useAuthContext();
    console.log(user);
    if(user === null && loading) {
        return (
            <>Loading...</>
        )
    }
    
    if(user === null && !loading) {
        return (
            <>Some error...</>
        )
    }
   
    return (
            //@ts-ignore
            <Room userId = {user.id}/>
    );
};

export default Root;

