"use client";

import { WS_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@/draw/Canvas";
import { CircleIcon, SquareIcon, PencilIcon, UserRoundMinus, SettingsIcon } from "lucide-react";
import useAuthContext from "@/hooks/useAuthContext";
import RoomModal from "./ui/RoomModal";
import { getRoom } from "@/lib/api";

const Room = ({ slug, userId }: {slug?: string, userId?: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<Canvas>();
    const [roomId, setRoomId] = useState(null);
    const [isMenuBar, setIsMenuBar] = useState<boolean>(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const { logout } = useAuthContext();

    useEffect(() => {

        if(!slug?.trim()) {
            return;
        }

        const getRoomId = async () => {
            try {
                const data = await getRoom(slug);
                setRoomId(data.id);
            }
            catch(ex) {
                console.log(ex);
            }
        }

        getRoomId();
    }, [slug]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        let g;
        if(!token) return;
        
        const canva = canvasRef.current;
        if (!canva) return;

        const ctx = canva.getContext("2d");
        if(!ctx) return;

        if(roomId) {
            const ws = new WebSocket(`${WS_URL}`, ["auth", token]);
            if(!ws) return;

            ws.onopen = () => {
                console.log("Socket connected");
                ws.send(JSON.stringify({
                    type: "join-room",
                    roomId: Number(roomId)

                }))
            };

            g = new Canvas(canva, ws, roomId, null);
            setCanvas(g);
        }
        else{
            g = new Canvas(canva, null, null, userId ? userId : null);
            setCanvas(g);
        }

        
        return () => {
            g.destroy();
        }
    }, []);

    const handleLogout = async () => {
        setLogoutLoading(true);
        logout();
        setLogoutLoading(false);
    }

    return (
        <>
           <div className="flex relative h-screen w-screen">
                 <canvas
                    ref={canvasRef}
                    width={window.innerWidth} 
                    height={window.innerHeight}
                    className="bg-white"
                    style={{
                        transform: `scale(${canvas?.scale})`
                    }}
                ></canvas>
                <div 
                className="absolute right-0 m-4 mr-6 cursor-pointer z-10 flex flex-col gap-0.5 p-2"
                >
                    <SettingsIcon 
                    className="cursor-pointer hover:text-gray-500"
                    onClick={() => setIsMenuBar(prev => !prev)}
                    />
                </div>
                {/* Logout button */}
                {
                    isMenuBar && (
                        <div className="bg-gray-100 absolute top-12 right-12 p-4 rounded-lg text-sm border-2 border-gray-300">
                            <div className="bg-white rounded-md border-2 border-gray-300 p-2">
                                <div 
                                className="cursor-pointer bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-sm text-gray-600 hover:text-gray-500 font-semibold"
                                onClick={() => setIsModal(true)}
                                >
                                    Create a room
                                </div>
                                <div 
                                className="cursor-pointer bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-sm text-gray-600 hover:text-gray-500 font-semibold"
                                onClick={handleLogout}
                                >
                                    {
                                        logoutLoading ? "Logout..." : "Logout"
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className="absolute z-10 w-60 ring-1 ring-gray-600/20 rounded-xl flex gap-2 p-2 m-4 bg-slate-800 shadow-lg shadow-red-700/30">
                    <div 
                    className="p-2 hover:bg-gray-600 text-gray-400 hover:text-white transition-all duration-200 rounded-lg max-h-min cursor-pointer"

                    >
                        <SquareIcon 
                        onClick={() => canvas?.setShapeType("rect")}
                        className="text-inherit"
                        />
                    </div>
                    <div className="p-2 hover:bg-gray-600 text-gray-400 hover:text-white transition-all duration-200 rounded-lg max-h-min cursor-pointer">
                        <CircleIcon
                        onClick={() => canvas?.setShapeType("circle")}
                        className="text-inherit w-6 h-6"
                        />
                    </div>
                    <div className="p-2 hover:bg-gray-600 text-gray-400 hover:text-white transition-all duration-200 rounded-lg max-h-min cursor-pointer">
                        <PencilIcon className="text-inherit" onClick={() => canvas?.setShapeType("pen")}/>
                    </div>
                </div>
                <div className="absolute z-10 left-10 bottom-0 ring-1 ring-gray-600/20 shadow-sm rounded-xl flex gap-2 p-2 m-4">
                    <button 
                    className="cursor-pointer border-r-2 px-3 pr-4 border-gray-300 text-lg"
                    onClick={() => canvas?.setScale(0.5)}
                    >-</button>
                    <span className="border-r-2 px-3 pr-4 border-gray-300 text-gray-600">percent</span>
                    <button 
                    className="cursor-pointer px-3 pr-4 border-gray-300 text-gray-600"
                    onClick={() => canvas?.setScale(2)}
                    >+</button>
                </div>
           </div>
           {
            isModal && <RoomModal setIsModal={setIsModal}/>
           }
        </>
    );
};

export default Room;

