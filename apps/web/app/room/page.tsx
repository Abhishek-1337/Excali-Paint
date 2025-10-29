import Link from 'next/link';
import axios from 'axios';
import { BACKEND_URL } from '../../lib/config';

type Room = {
    id: string;
    slug: string;
    adminId: string;
}

const getAllRooms = async () => {
    try{
        const res = await axios.get(`${BACKEND_URL}/rooms`);
        return res.data.rooms;
    }
    catch(ex){
        return null;
    }
}

const NavigateRooms = async () => {
    const rooms = await getAllRooms();
    return (
        <>
            <ul>
            {
                rooms.map((room: Room) => {
                    return (
                        <li key={room.id}>
                        <Link href={`/room/${room.slug}`}  className='text-white'>{room.slug}</Link>
                        </li>
                    )
                })
            }
            </ul>
        </>
    );
}

export default NavigateRooms;