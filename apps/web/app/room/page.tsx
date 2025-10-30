"use client"

import Link from 'next/link';
import axios from 'axios';
import { BACKEND_URL } from '../../lib/config';
import { useEffect, useState } from 'react';

type Room = {
    id: string;
    slug: string;
    adminId: string;
}

const NavigateRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getAllRooms = async () => {
            try{
                const res = await axios.get(`${BACKEND_URL}/rooms`);
                setLoading(false);
                setRooms(res.data.rooms);
            }
            catch(ex){
                return null;
            }
        }       

        getAllRooms();
    },[]);

    return (
        <>
            <ul className="flex gap-2 flex-col w-30">
            {loading ? <p>Loading...</p> : rooms.length !== 0  ? (rooms.map((room: Room) => {
                    return (
                        <li key={room.id} className="bg-white pl-3 p-1 rounded-lg text-black text-center">
                        <Link href={`/room/${room.slug}`}>{room.slug}</Link>
                        </li>
                    )
                })) : <p>No room is available.</p>
            }
            </ul>
        </>
    );
}

export default NavigateRooms;