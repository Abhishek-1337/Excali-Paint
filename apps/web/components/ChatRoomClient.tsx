"use client"

import { useEffect, useState } from "react";
import { WS_URL } from "../lib/config";


//@ts-ignore
const ChatRoomClient = ({messages}) => {
    const [socket, setSocket] = useState<WebSocket>();
    const [message, setMessage] = useState<string>("");
    
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMjNkYmRiNC1lMjUwLTQ4YzMtYWZhNi02MjYxMzUwYzk1MWMiLCJpYXQiOjE3NjE2NzY5MjB9.EdRSxPjqB_CDo7fTD7RzcXmQ6YclcOQpiNT38k4MmXE`);
        setSocket(ws);
        if(ws) {
            ws.onopen = () => {
                console.log("Socket open");
            };

            ws.onmessage = (event) => {
                console.log(event.data);
            }
        }
    }, []);

    const sendMessage = () => {
        socket?.send(JSON.stringify(
            {
            type: "chat",
            message: "Hii"
        }
        ));
    }
    return (
        <>
            <ul>
                {
                    messages.map((m: string) => {
                        return <li>{m}</li>
                    })
                }
            </ul>
            <input type="text" placeholder="Write your message..."/>
            <button onClick={() => sendMessage()}>Send</button>
        </>
    );
}

export default ChatRoomClient;