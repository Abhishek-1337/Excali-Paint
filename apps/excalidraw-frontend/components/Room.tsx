"use client";

import { BACKEND_URL, WS_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

type ShapeType = "rect" | "circle";

type ExistingShapes = {
    type: ShapeType;
    start: number;
    end: number;
    width: number;
    height: number;
}
let existingShapes: ExistingShapes[] = [];

const Room = ({ roomId }: {roomId: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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
                delete parsedShape.type;
                ctx.strokeRect(parsedShape.start, parsedShape.end, parsedShape.width, parsedShape.height);
            });
        }
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMjNkYmRiNC1lMjUwLTQ4YzMtYWZhNi02MjYxMzUwYzk1MWMiLCJpYXQiOjE3NjM0MDQwMjR9.ptHkee9SAC6pzjUcAU6HVRxKA1AX28qyT8vG6jU6Fl4`);
        if(!ws) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        getAllMessages(ctx);

        setSocket(ws);

        ws.onopen = () => {
            console.log("Socket connected");
            ws.send(JSON.stringify({
                type: "join-room",
                roomId: Number(roomId)

            }))
        };

        ws.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            if(parsedData.roomId === Number(roomId)) {
                const parsedShape = JSON.parse(parsedData.message);
                existingShapes.push(
                    parsedShape
                );
                ctx.strokeRect(parsedShape.start, parsedShape.end, parsedShape.width, parsedShape.height);
            }
        }
        

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const width = e.clientX - startX;
            const height = e.clientY - startY;

            // draw main rectangle
            // ctx.fillStyle = "rgba(0, 0, 0)"
            ctx.strokeStyle = "black";
            clearCanvas(ctx, canvas);
            ctx.strokeRect(startX, startY, width, height);
            existingShapes.forEach((shape) => {
                ctx.strokeStyle = "black";
                ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
            });
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            
        };

        const onMouseUp = (e: any) => {
            isDragging = false;
            const shape: ExistingShapes = {
                type: "rect",
                start: startX,
                end: startY,
                width: e.offsetX - startX,
                height: e.offsetY - startY
            };
            existingShapes.push(shape);
            ws.send(JSON.stringify({
                type: "chat",
                roomId: Number(roomId),
                message: JSON.stringify(shape)
            }));
            console.log(existingShapes);  
        };        
        

        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", onMouseUp);

        return () => {
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseup", onMouseUp);
            ws.close();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            className="bg-white"
        />
    );
};

export default Room;

