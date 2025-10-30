import { useEffect, useState } from "react";
import { WS_URL } from "../lib/config";

const useSocket = () => {
    const [ socket, setSocket ] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMjNkYmRiNC1lMjUwLTQ4YzMtYWZhNi02MjYxMzUwYzk1MWMiLCJpYXQiOjE3NjE4NDY5NTJ9.8XGwRyyxsGDMOC59Br9vaeqnpG5w6QFgYrv4hz_XLHY`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);
    return {socket, loading};
}

export default useSocket;