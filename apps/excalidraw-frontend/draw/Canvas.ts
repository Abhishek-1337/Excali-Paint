import { getAllMessages } from "@/lib/api/canvas";
import { ExistingShapes, pen } from "@/types/types";

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
    private coordinates: {x: number, y: number}[] = [];


    constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.socket = socket;
        this.roomId = roomId;
        this.init();
        this.initMouseHandlers();
    }

    async init() {

        console.log(this.existingShapes);

        this.socket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            if(parsedData.roomId === Number(this.roomId)) {
                const parsedShape = JSON.parse(parsedData.message);
                this.existingShapes.push(
                    parsedShape
                );
                this.clearCanvas();
            }
        }

        const res = await getAllMessages(this.roomId);
        if(res && !res.error) {
            if(res.messages && res.messages.length !== 0) {
            //@ts-ignore
                res.messages.forEach((obj) => {
                    const parsedShape = JSON.parse(obj.message);
                    this.existingShapes.push(parsedShape);
                });
            }
        }

        this.clearCanvas();

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
        const x = e.clientX;
        const y = e.clientY;

        this.ctx.strokeStyle = "black";
        
        if(this.shapeType === "rect") {
            this.clearCanvas();
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        }
        else if(this.shapeType === "circle") {
            this.radius = Math.max(width, height) / 2;
            this.x = this.startX + this.radius;
            this.clearCanvas();

            this.ctx.beginPath();
            this.ctx.arc(this.x, this.startY, this.radius, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
        }
        else {
            this.coordinates.push({x: this.startX, y: this.startY});
            this.ctx.beginPath();
            this.ctx.setLineDash([]);
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(x,y);
            this.ctx.stroke();

            this.startX = x;
            this.startY = y;
        }

        // this.existingShapes.forEach((shape) => {
        //         this.ctx.strokeStyle = "black";
        //         if(shape.type === "rect") {
        //             this.ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
        //         }
        //         else if(shape.type === "circle"){
        //             this.ctx.beginPath();
        //             this.ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle, shape.endAngle);
        //             this.ctx.stroke();
        //             this.ctx.closePath();
        //         }
        // });
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
        else if(this.shapeType === "circle"){
            shape = {
                type: "circle",
                x: this.x,
                y: this.startY,
                radius: this.radius,
                startAngle: 0,
                endAngle: 2*Math.PI
            }
        }
        else {
            this.coordinates.push({x: e.clientX, y: e.clientY});
            shape = {
                type: "pen",
                coordinates: this.coordinates
            }
        }

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
                else if(shape.type === "circle"){
                    this.ctx.beginPath();
                    this.ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle, shape.endAngle);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
                else {
                    let positions = shape.coordinates;
                    let x = positions[0].x;
                    let y = positions[1].y;
                    for(let i = 1; i < positions.length; i++) {
                        this.ctx.beginPath();
                        this.ctx.setLineDash([]);
                        this.ctx.moveTo(x, y);
                        this.ctx.lineTo(positions[i].x, positions[i].y);
                        this.ctx.stroke();

                        x = positions[i].x;
                        y = positions[i].y;
                    } 
                }
            })
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.canvas.addEventListener("mouseup", this.onMouseUp);
    }
}