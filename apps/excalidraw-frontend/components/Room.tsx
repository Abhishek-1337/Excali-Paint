"use client";

import { WS_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@/draw/Canvas";
import { CircleIcon, SquareIcon, PencilIcon } from "lucide-react";

const Room = ({ roomId }: {roomId: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<Canvas>();
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMjNkYmRiNC1lMjUwLTQ4YzMtYWZhNi02MjYxMzUwYzk1MWMiLCJpYXQiOjE3NjM0MDQwMjR9.ptHkee9SAC6pzjUcAU6HVRxKA1AX28qyT8vG6jU6Fl4`);
        if(!ws) return;

        ws.onopen = () => {
            console.log("Socket connected");
            ws.send(JSON.stringify({
                type: "join-room",
                roomId: Number(roomId)

            }))
        };

        const g = new Canvas(canvas, ws, roomId);
        setCanvas(g);

    }, []);


    return (
        <>
           <div className="flex relative h-screen w-screen">
                 <canvas
                    ref={canvasRef}
                    width={window.innerWidth} 
                    height={window.innerHeight}
                    className="bg-white"
                    style={{
                        transform: `scale(${scale})`
                    }}
                ></canvas>
                <div className="absolute z-10 w-60 ring-1 ring-gray-600/20 shadow-sm rounded-xl flex gap-2 p-2 m-4">
                    <div 
                    className="p-2 hover:bg-gray-400 text-gray-600 hover:text-white transition-all duration-200 rounded-lg max-h-min cursor-pointer"

                    >
                        <SquareIcon 
                        onClick={() => canvas?.setShapeType("rect")}
                        className="text-inherit"
                        />
                    </div>
                    <div className="p-2 hover:bg-gray-400 text-gray-600 hover:text-white transition-all duration-200 rounded-lg max-h-min cursor-pointer">
                        <CircleIcon
                        onClick={() => canvas?.setShapeType("circle")}
                        className="text-inherit w-6 h-6"
                        />
                    </div>
                    <div className="p-2 hover:bg-gray-400 text-gray-600 hover:text-white transition-all duration-200 rounded-lg max-h-min cursor-pointer">
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
        </>
    );
};

export default Room;

