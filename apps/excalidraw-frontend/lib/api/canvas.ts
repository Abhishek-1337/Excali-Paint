import axios from "axios";
import { BACKEND_URL } from "../config";
import { apiClient } from ".";
import { ExistingShapes } from "@/types/types";

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
        const res = await axios.get(`${BACKEND_URL}/chat/user/${userId}`);
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

export const postCanvas = async (canvas: ExistingShapes, userId: string) => {
    const res = await apiClient.post(`${BACKEND_URL}/canvas/${userId}`, canvas); 
    return res.data;
}