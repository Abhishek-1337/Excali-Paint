"use client";

import { WS_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";

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


    useEffect(() => {
        const canvas = canvasRef.current;
        console.log(WS_URL);
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMjNkYmRiNC1lMjUwLTQ4YzMtYWZhNi02MjYxMzUwYzk1MWMiLCJpYXQiOjE3NjM0MDQwMjR9.ptHkee9SAC6pzjUcAU6HVRxKA1AX28qyT8vG6jU6Fl4`);
        if(!ws) return;
        setSocket(ws);
        ws.onopen = () => {
            console.log("Socket connected");
            ws.send(JSON.stringify({
                type: "join-room",
                roomId: Number(roomId)

            }))
        };

        ws.onmessage = (event) => {
            console.log(event);
        }
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        const onMouseDown = (e: MouseEvent) => {
            console.log("hello");
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const width = e.clientX - startX;
            const height = e.clientY - startY;

            console.log(e.clientX - startX);

            
            // draw main rectangle
            // ctx.fillStyle = "rgba(0, 0, 0)"
            ctx.clearRect(0,0, canvas.width, canvas.height);
            existingShapes.forEach((shape) => {
                ctx.strokeStyle = "black";
                ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
            });
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "black";
            ctx.strokeRect(startX, startY, width, height);
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
            console.log(socket);
            ws.send(JSON.stringify({
                type: "chat",
                roomId: Number(roomId),
                message: JSON.stringify(shape)
            }));
            // console.log(existingShapes);

            
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
            width={5000}
            height={5000}
            className="bg-white"
        />
    );
};

export default Room;

