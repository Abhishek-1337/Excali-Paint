"use client";

import { WS_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@/draw/Canvas";
import { CircleIcon, SquareIcon, PencilIcon, UserRoundMinus, SettingsIcon, LogOut, PlusSquare } from "lucide-react";
import useAuthContext from "@/hooks/useAuthContext";
import RoomModal from "./ui/RoomModal";

const Room = ({ roomId, userId }: {roomId?: string, userId?: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<Canvas>();
    const [isMenuBar, setIsMenuBar] = useState<boolean>(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [activeShape, setActiveShape] = useState<string>("pen");
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
            console.log(canva);
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

    const handleShapeChange = (shape: string) => {
        setActiveShape(shape);
        canvas?.setShapeType(shape);
    }

    return (
        <>
           <div className="flex relative h-screen w-screen bg-gray-50">
                 <canvas
                    ref={canvasRef}
                    width={window.innerWidth} 
                    height={window.innerHeight}
                    className="bg-white shadow-inner"
                    style={{
                        transform: `scale(${canvas?.scale})`
                    }}
                ></canvas>
                
                {/* Settings Button */}
                <div className="absolute right-0 m-6 z-10">
                    <button
                        className="p-2.5 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setIsMenuBar(prev => !prev)}
                        aria-label="Settings"
                    >
                        <SettingsIcon className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {/* Menu Dropdown */}
                {isMenuBar && (
                    <div className="absolute top-20 right-6 z-20 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden min-w-[200px]">
                        <div className="p-2 space-y-1">
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 font-medium text-sm group"
                                onClick={() => setIsModal(true)}
                            >
                                <PlusSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Create a room
                            </button>
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 font-medium text-sm group"
                                onClick={handleLogout}
                                disabled={logoutLoading}
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {logoutLoading ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tools Toolbar */}
                <div className="absolute z-10 top-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl flex gap-1 p-2 shadow-lg border border-gray-200">
                    <button
                        className={`p-3 transition-all duration-200 rounded-xl ${
                            activeShape === "rect"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        onClick={() => handleShapeChange("rect")}
                        aria-label="Rectangle tool"
                    >
                        <SquareIcon className="w-5 h-5" />
                    </button>
                    <button
                        className={`p-3 transition-all duration-200 rounded-xl ${
                            activeShape === "circle"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        onClick={() => handleShapeChange("circle")}
                        aria-label="Circle tool"
                    >
                        <CircleIcon className="w-5 h-5" />
                    </button>
                    <button
                        className={`p-3 transition-all duration-200 rounded-xl ${
                            activeShape === "pen"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        onClick={() => handleShapeChange("pen")}
                        aria-label="Pen tool"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="absolute z-10 left-6 bottom-6 bg-white rounded-xl flex items-center gap-1 p-1.5 shadow-lg border border-gray-200">
                    <button
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-semibold text-lg"
                        onClick={() => canvas?.setScale(0.5)}
                        aria-label="Zoom out"
                    >
                        −
                    </button>
                    <div className="px-4 py-2 text-gray-600 font-medium text-sm min-w-[80px] text-center border-x border-gray-200">
                        {canvas?.scale ? `${Math.round(canvas.scale * 100)}%` : "100%"}
                    </div>
                    <button
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-semibold text-lg"
                        onClick={() => canvas?.setScale(2)}
                        aria-label="Zoom in"
                    >
                        +
                    </button>
                </div>
           </div>
           {isModal && <RoomModal setIsModal={setIsModal}/>}
        </>
    );
};

export default Room;