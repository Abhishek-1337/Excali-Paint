"use client";

import { WS_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@/draw/Canvas";
import { CircleIcon, SquareIcon, PencilIcon, UserRoundMinus } from "lucide-react";
import useAuthContext from "@/hooks/useAuthContext";
import RoomModal from "./ui/RoomModal";

const Room = ({ roomId, userId }: {roomId?: string, userId?: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<Canvas>();
    const [isMenuBar, setIsMenuBar] = useState<boolean>(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const { logout } = useAuthContext();

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
                onClick={() => setIsMenuBar(prev => !prev)}
                >
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                </div>
                {/* Logout button */}
                {
                    isMenuBar && (
                        <div className="bg-gray-300 absolute top-10 right-10 p-2 rounded-lg text-sm">
                            <div 
                            className="cursor-pointer bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-sm text-gray-600 hover:text-gray-200 font-semibold"
                            onClick={() => setIsModal(true)}
                            >
                                Create a room
                            </div>
                            <div 
                            className="cursor-pointer bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-sm text-gray-600 hover:text-gray-200 font-semibold"
                            onClick={handleLogout}
                            >
                                {
                                    logoutLoading ? "Logout..." : "Logout"
                                }
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

