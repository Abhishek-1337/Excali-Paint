
import axios from 'axios';
import { BACKEND_URL } from '../lib/config';
import ChatRoomClient from './ChatRoomClient';

const getRoomMessages = async (roomId: number) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
        console.log(response);
        return response.data.messages;
    }
    catch(ex){
        console.log(ex);
    }
}

const ChatRoom = async ({
    roomId
}: {roomId : number}) => {
    const messages = await getRoomMessages(roomId);
    console.log(messages);
    return (
        <>
        <ChatRoomClient messages={messages}/>
        </>
    );
}

export default ChatRoom;

