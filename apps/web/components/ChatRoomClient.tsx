import { useEffect } from "react";
import { WS_URL } from "../lib/config";

const ChatRoomClient = () => {
    
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=`);
        if(ws) {
            ws.onopen = () => {
                ws.send("hello server");
            };
        }
    }, []);
    return (
        <>
            <input type="text" placeholder="Write your message..."/>
            <button>Send</button>
        </>
    );
}

export default ChatRoomClient;