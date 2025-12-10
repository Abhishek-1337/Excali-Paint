"use client";

import { BACKEND_URL, WS_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { initDraw } from "@/lib/canvas";
import { ExistingShapes } from "@/types/types";


type ShapeType = "rect" | "circle";

let existingShapes: ExistingShapes[] = [];

const Room = ({ roomId }: {roomId: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasType, setCanvasType] = useState<ShapeType>("rect");
    const [socket, setSocket] = useState<WebSocket>();

    function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.clearRect(0,0, canvas.width, canvas.height);
    }

    async function getAllMessages(ctx:CanvasRenderingContext2D) {
        const res = await axios.get(`${BACKEND_URL}/chat/${Number(roomId)}`);
        const messages = res.data.messages;
        if(messages && messages.length !== 0) {
            //@ts-ignore
            messages.forEach((obj) => {
                const parsedShape = JSON.parse(obj.message);
                existingShapes.push(parsedShape);
                if(parsedShape.type === "rect") {
                    ctx.strokeRect(parsedShape.start, parsedShape.end, parsedShape.width, parsedShape.height);
                }
                else {
                    ctx.beginPath();
                    ctx.arc(parsedShape.x, parsedShape.y, parsedShape.radius, parsedShape.startAngle, parsedShape.endAngle);
                    ctx.stroke();
                    ctx.closePath();
                }
            });
        }
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if(!ctx) return;
        getAllMessages(ctx);
        
        initDraw(roomId, canvas, existingShapes);

    }, []);
    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;
        
    //     const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMjNkYmRiNC1lMjUwLTQ4YzMtYWZhNi02MjYxMzUwYzk1MWMiLCJpYXQiOjE3NjM0MDQwMjR9.ptHkee9SAC6pzjUcAU6HVRxKA1AX28qyT8vG6jU6Fl4`);
    //     if(!ws) return;
        
    //     const ctx = canvas.getContext("2d");
    //     if (!ctx) return;
    //     getAllMessages(ctx);

    //     setSocket(ws);

    //     ws.onopen = () => {
    //         console.log("Socket connected");
    //         ws.send(JSON.stringify({
    //             type: "join-room",
    //             roomId: Number(roomId)

    //         }))
    //     };

    //     ws.onmessage = (event) => {
    //         const parsedData = JSON.parse(event.data);
    //         if(parsedData.roomId === Number(roomId)) {
    //             const parsedShape = JSON.parse(parsedData.message);
    //             existingShapes.push(
    //                 parsedShape
    //             );
    //             ctx.strokeRect(parsedShape.start, parsedShape.end, parsedShape.width, parsedShape.height);
    //         }
    //     }
        

    //     let startX = 0;
    //     let startY = 0;
    //     let x = 0;
    //     let radius = 0;
    //     let isDragging = false;

    //     const onMouseDown = (e: MouseEvent) => {
    //         isDragging = true;
    //         startX = e.clientX;
    //         startY = e.clientY;

    //     };

    //     const onMouseMove = (e: MouseEvent) => {
    //         if (!isDragging) return;

    //         const width = e.clientX - startX;
    //         const height = e.clientY - startY;
    //         // draw main rectangle
    //         // ctx.fillStyle = "rgba(0, 0, 0)"
    //         ctx.strokeStyle = "black";
    //         clearCanvas(ctx, canvas);
    //         //@ts-ignore
    //         if(window.shapeType === "rect") {
    //             ctx.strokeRect(startX, startY, width, height);
    //         }
    //         // else if(cType === "circle") {
    //         //@ts-ignore
    //         else if(window.shapeType === "circle") {
    //             radius = Math.max(width, height) / 2;
    //             x = startX + radius;

    //             ctx.beginPath();
    //             ctx.arc(x, startY, radius, 0, 2*Math.PI);
    //             ctx.stroke();
    //             ctx.closePath();
    //         }

    //         existingShapes.forEach((shape) => {
    //                 ctx.strokeStyle = "black";
    //                 if(shape.type === "rect") {
    //                     ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
    //                 }
    //                 else{
    //                     ctx.beginPath();
    //                     ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle, shape.endAngle);
    //                     ctx.stroke();
    //                     ctx.closePath();
    //                 }
    //         });
    //         // ctx.fillRect(0, 0, canvas.width, canvas.height);
            
    //     };

    //     const onMouseUp = (e: any) => {
    //         isDragging = false;
    //         let shape: ExistingShapes;
    //         //@ts-ignore
    //         if(window.shapeType === "rect") {
    //             shape = {
    //                 type: "rect",
    //                 start: startX,
    //                 end: startY,
    //                 width: e.offsetX - startX,
    //                 height: e.offsetY - startY
    //             };
    //         }
    //         else{
    //             shape = {
    //                 type: "circle",
    //                 x,
    //                 y: startY,
    //                 radius,
    //                 startAngle: 0,
    //                 endAngle: 2*Math.PI
    //             }
    //         }

    //         console.log(shape);
    //         existingShapes.push(shape);
    //         ws.send(JSON.stringify({
    //             type: "chat",
    //             roomId: Number(roomId),
    //             message: JSON.stringify(shape)
    //         }));
    //         console.log(existingShapes);  
    //     };        
        

    //     canvas.addEventListener("mousedown", onMouseDown);
    //     canvas.addEventListener("mousemove", onMouseMove);
    //     canvas.addEventListener("mouseup", onMouseUp);

    //     return () => {
    //         canvas.removeEventListener("mousedown", onMouseDown);
    //         canvas.removeEventListener("mousemove", onMouseMove);
    //         canvas.removeEventListener("mouseup", onMouseUp);
    //         ws.close();
    //     };
    // }, []);

    return (
        <>
           <div className="flex relative h-screen w-screen">
                 <canvas
                    ref={canvasRef}
                    width={window.innerWidth} 
                    height={window.innerHeight}
                    className="bg-white"
                ></canvas>
                <div className="absolute z-10 w-60 min-h-20 bg-gray-600 rounded-lg flex gap-4 p-4 m-4 items-center">
                    <button 
                    className="w-8 h-8 border-2 border-white hover:w-9 hover:h-9 cursor-pointer"
                    onClick={() => {
                        //@ts-ignore
                        window.shapeType = "rect"
                    }}
                    ></button>
                    <button 
                    className="w-8 h-8 border-2 border-white rounded-full hover:w-9 hover:h-9 cursor-pointer"
                    onClick={() => 
                        {
                            //@ts-ignore 
                            window.shapeType = "circle"
                            // setCanvasType("circle")
                        }
                    }
                    ></button>
                </div>
           </div>
        </>
    );
};

export default Room;

