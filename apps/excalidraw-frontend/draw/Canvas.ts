import { getAllMessages } from "@/lib/api/canvas";
import { ExistingShapes } from "@/types/types";

export class Canvas {
    private ctx;
    private socket;
    private roomId;
    private existingShapes: ExistingShapes[] = [];
    private startX = 0;
    private startY = 0;
    private isDragging = false;
    private canvas;
    private shapeType: string = "rect";
    private x = 0;
    private radius = 0;


    constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.socket = socket;
        this.roomId = roomId;
        this.init();
        this.initMouseHandlers();
    }

    async init() {

        this.socket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            if(parsedData.roomId === Number(this.roomId)) {
                const parsedShape = JSON.parse(parsedData.message);
                this.existingShapes.push(
                    parsedShape
                );
                this.ctx.strokeRect(parsedShape.start, parsedShape.end, parsedShape.width, parsedShape.height);
            }
        }

        const res = await getAllMessages(this.roomId);
        if(res && !res.error) {
            if(res.messages && res.messages.length !== 0) {
            //@ts-ignore
                res.messages.forEach((obj) => {
                    const parsedShape = JSON.parse(obj.message);
                    this.existingShapes.push(parsedShape);
                    console.log(parsedShape);
                    if(parsedShape.type === "rect") {
                        this.ctx.strokeRect(parsedShape.start, parsedShape.end, parsedShape.width, parsedShape.height);
                    }
                    else {
                        this.ctx.beginPath();
                        this.ctx.arc(parsedShape.x, parsedShape.y, parsedShape.radius, parsedShape.startAngle, parsedShape.endAngle);
                        this.ctx.stroke();
                        this.ctx.closePath();
                    }
                });
            }
        }

        console.log(this.existingShapes);
    }

    setShapeType(shapeType: string) {
        this.shapeType = shapeType;
    }

    onMouseDown = (e: MouseEvent) => {
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    };

    onMouseMove = (e: MouseEvent) => {
        if (!this.isDragging) return;

        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        this.ctx.strokeStyle = "black";
        this.clearCanvas();

        if(this.shapeType === "rect") {
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        }
        else if(this.shapeType === "circle") {
            this.radius = Math.max(width, height) / 2;
            console.log(this.radius);
            this.x = this.startX + this.radius;

            this.ctx.beginPath();
            this.ctx.arc(this.x, this.startY, this.radius, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.existingShapes.forEach((shape) => {
                this.ctx.strokeStyle = "black";
                if(shape.type === "rect") {
                    this.ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
                }
                else{
                    this.ctx.beginPath();
                    this.ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle, shape.endAngle);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
        });
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        
    };

    onMouseUp = (e: any) => {
        this.isDragging = false;
        let shape: ExistingShapes;
        //@ts-ignore
        if(this.shapeType === "rect") {
            shape = {
                type: "rect",
                start: this.startX,
                end: this.startY,
                width: e.offsetX - this.startX,
                height: e.offsetY - this.startY
            };
        }
        else{
            shape = {
                type: "circle",
                x: this.x,
                y: this.startY,
                radius: this.radius,
                startAngle: 0,
                endAngle: 2*Math.PI
            }
        }

        console.log(shape);
        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            roomId: Number(this.roomId),
            message: JSON.stringify(shape)
        }));
        console.log(this.existingShapes);  
    };        
    

    clearCanvas() {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.existingShapes.forEach((shape) => {
                if(shape.type === "rect") {
                    this.ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
                }
                else {
                    this.ctx.beginPath();
                    this.ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle, shape.endAngle);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            })
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.canvas.addEventListener("mouseup", this.onMouseUp);
    }
}