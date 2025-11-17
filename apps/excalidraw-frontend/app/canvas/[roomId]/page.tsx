"use client";

import { useEffect, useRef } from "react";

type ExistingShapes = {
    type: "rect" | "circle";
    start: number;
    end: number;
    width: number;
    height: number;
}
let existingShapes: ExistingShapes[] = [];

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);



    useEffect(() => {
        const canvas = canvasRef.current;
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
            existingShapes.push({
                type: "rect",
                start: startX,
                end: startY,
                width: e.offsetX - startX,
                height: e.offsetY - startY
            });

            // console.log(existingShapes);

            
        };        
        

        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", onMouseUp);

        return () => {
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseup", onMouseUp);
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

export default Canvas;
