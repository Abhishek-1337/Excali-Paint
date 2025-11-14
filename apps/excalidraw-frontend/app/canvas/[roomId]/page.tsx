"use client";

import { ContextType, useEffect, useRef } from "react";

type ExistingShapes = {
    type: "rect" | "circle";
    start: number;
    end: number;
    width: number;
    height: number;
}

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let existingShapes: ExistingShapes[] = [];


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
            startX = e.offsetX;
            startY = e.offsetY;

        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const width = e.offsetX - startX;
            const height = e.offsetY - startY;

            console.log(e.offsetX - startX);

            ctx.clearRect(startX, startY, width, height);

            // draw main rectangle
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

            console.log(existingShapes);

            ctx.clearRect(0,0,canvas.width, canvas.height);
            existingShapes.forEach((shape) => {
            if(shape.type === "rect") {
                ctx.strokeStyle = "black";
                ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
            }
        });
        };        
        

        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
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
