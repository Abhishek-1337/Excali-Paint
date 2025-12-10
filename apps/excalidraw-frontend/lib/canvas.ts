import { ExistingShapes } from "@/types/types";
import { WS_URL } from "./config";

let startX = 0;
let startY = 0;
let isDragging = false;

export function initDraw(roomId: string, canvas: HTMLCanvasElement, existingShapes: ExistingShapes[]) {

    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMjNkYmRiNC1lMjUwLTQ4YzMtYWZhNi02MjYxMzUwYzk1MWMiLCJpYXQiOjE3NjM0MDQwMjR9.ptHkee9SAC6pzjUcAU6HVRxKA1AX28qyT8vG6jU6Fl4`);
    if(!ws) return;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // setSocket(ws);
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
    
    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const width = e.clientX - startX;
        const height = e.clientY - startY;

        // draw main rectangle
        // ctx.fillStyle = "rgba(0, 0, 0)"
        ctx.strokeStyle = "black";
        clearCanvas(ctx, canvas);
        ctx.strokeRect(startX, startY, width, height);
        existingShapes.forEach((shape : any) => {
            ctx.strokeStyle = "black";
            ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
        });
    };


    const onMouseDown = (e: MouseEvent) => {
        console.log("hello");
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
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

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
       
}



function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.clearRect(0,0, canvas.width, canvas.height);
}