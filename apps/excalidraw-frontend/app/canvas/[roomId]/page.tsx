"use client";

import { useEffect, useRef } from "react";

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
            startX = e.offsetX;
            startY = e.offsetY;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const width = e.offsetX - startX;
            const height = e.offsetY - startY;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // draw main rectangle
            ctx.strokeStyle = "black";
            ctx.strokeRect(startX, startY, width, height);
        };

        const onMouseUp = () => {
            isDragging = false;
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
            width={1000}
            height={1000}
            className="w-screen h-screen"
        />
    );
};

export default Canvas;
