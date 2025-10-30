"use client"

import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";


//@ts-ignore
const ChatRoomClient = ({messages, roomId}) => {
    console.log(messages);
    const {socket, loading} = useSocket();
    const [message, setMessage] = useState<string>("");
    
    useEffect(() => {
        if(socket && !loading) {
            socket.send(JSON.stringify({
                type: "join-room",
                roomId: roomId
            }));

            socket.onmessage = (event) => {
                console.log(event.data);
            }
        }
    }, [socket, loading]);

    const sendMessage = () => {
        socket?.send(JSON.stringify(
            {
            type: "chat",
            message: "Hii",
            roomId: roomId
        }
        ));
    }
    return (
        <>
            <ul>
                {
                    //@ts-ignore
                    messages.map((m, i) => {
                        return <li key={`m${i}`}>{m.message}</li>
                    })
                }
            </ul>
            <input type="text" placeholder="Write your message..."/>
            <button onClick={() => sendMessage()}>Send</button>
        </>
    );
}

export default ChatRoomClient;