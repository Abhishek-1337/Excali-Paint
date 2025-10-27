import axios from 'axios';
import { BACKEND_URL } from '../../../lib/config';
import ChatRoom from '../../../components/ChatRoom';

const getRoom = async (slug: string) => {
    let response;
    try {
        response = await axios.get(`${BACKEND_URL}/room/${slug}`);
        return response.data.id;
    }
    catch(err) {
        console.log(err);
    }
}

 const Room = async ({
    params
}: {
    params: Promise<{slug: string}>
}) => {
    const awaitedParams = await params;
    const slug = awaitedParams.slug;

    if(slug === undefined) return;

    const roomId: number = await getRoom(slug);

    return (
        <>
        <h2>RoomId: {roomId}</h2>
        <ChatRoom roomId = {roomId}/>
        </>
    );
}

export default Room;