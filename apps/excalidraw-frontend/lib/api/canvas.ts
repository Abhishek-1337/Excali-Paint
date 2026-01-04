import axios from "axios";
import { BACKEND_URL } from "../config";

export async function getAllMessages(roomId: string) {
    try{
        const res = await axios.get(`${BACKEND_URL}/chat/${Number(roomId)}`);
        const messages = res.data.messages;
        return {
            error: false,
            messages
        }    
    }
    catch(ex) {
        return {
            error: true,
            message: "Request failed"
        }
    }
        
}

export async function getAllMessagesForUser(userId: string) {
    try{
        const res = await axios.get(`${BACKEND_URL}/chat/${Number(userId)}`);
        const messages = res.data.messages;
        return {
            error: false,
            messages
        }    
    }
    catch(ex) {
        return {
            error: true,
            message: "Request failed"
        }
    }
        
}