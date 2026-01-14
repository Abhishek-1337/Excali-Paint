import { getAllMessages, getAllMessagesForUser, postCanvas } from "@/lib/api/canvas";
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
    public scale = 1;
    private userId: string | null = "";


    constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, roomId: string | null, userId: string | null) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.socket = socket;
        this.roomId = roomId;
        this.userId = userId;
        this.init();
        this.initMouseHandlers();
    }

    async init() {
        if(this.socket !== null ) {
            this.socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.roomId === Number(this.roomId)) {
                    const parsedShape = JSON.parse(parsedData.message);
                    this.existingShapes.push(
                        parsedShape
                    );
                    // this.clearCanvas();
                    this.render();
                }
            }
        }
        if(this.roomId !== null) {
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
        }
        else if(this.userId){
            const res = await getAllMessagesForUser(this.userId);
            if(res && !res.error) {
                if(res.messages && res.messages.length !== 0) {
                //@ts-ignore
                    res.messages.forEach((obj) => {
                        const parsedShape = JSON.parse(obj.message);
                        this.existingShapes.push(parsedShape);
                    });
                }
            }
        }

        this.render();

    }

    setShapeType(shapeType: string) {
        this.shapeType = shapeType;
    }

    // setScale(factor: number) {
    //     this.scale *= factor;
    //     this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    //     this.ctx.scale(this.scale, this.scale);
    //     this.clearCanvas();
    // }

    setScale(factor: number) {
        this.scale *= factor;
        this.render();
    }

    onMouseDown = (e: MouseEvent) => {
        this.isDragging = true;
        this.startX = e.clientX/this.scale;
        this.startY = e.clientY/this.scale;
    };

    onMouseMove = (e: MouseEvent) => {
        if (!this.isDragging) return;

        const scaledClientX = e.clientX / this.scale;
        const scaledClientY = e.clientY / this.scale;

        const width = scaledClientX - this.startX;
        const height = scaledClientY - this.startY;
        const x = scaledClientX;
        const y = scaledClientY;

        this.ctx.strokeStyle = "black";
        
        if(this.shapeType === "rect") {
            // this.clearCanvas();
            this.render();
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        }
        else if(this.shapeType === "circle") {
            this.radius = Math.max(width, height) / 2;
            this.x = this.startX + this.radius;
            // this.clearCanvas();
            this.render();

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
        
    };

    onMouseUp = (e: any) => {
        this.isDragging = false;
        let shape: ExistingShapes;
        const scaledClientX = e.clientX / this.scale;
        const scaledClientY = e.clientY / this.scale;
        //@ts-ignore
        if(this.shapeType === "rect") {
            shape = {
                type: "rect",
                start: this.startX,
                end: this.startY,
                width: scaledClientX - this.startX,
                height: scaledClientY - this.startY
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
            this.coordinates.push({x: scaledClientX, y: scaledClientY});
            shape = {
                type: "pen",
                coordinates: this.coordinates
            }
        }

        this.existingShapes.push(shape);
        if(this.roomId !== null) {
            if(this.socket !== null) {
                this.socket.send(JSON.stringify({
                    type: "chat",
                    roomId: Number(this.roomId),
                    message: JSON.stringify(shape)
                }));
            }
        }
        else if(this.userId !== null) {
            try {
                postCanvas(shape, this.userId);
            }
            catch(ex) {
                console.log(ex);
            }
        }

        this.coordinates = [];
    };        

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    

    // clearCanvas() {
    //         this.ctx.save();
    //         this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    //         this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    //         this.existingShapes.forEach((shape) => {
    //             if(shape.type === "rect") {
    //                 this.ctx.strokeRect(shape.start, shape.end, shape.width, shape.height);
    //             }
    //             else if(shape.type === "circle"){
    //                 this.ctx.beginPath();
    //                 this.ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle, shape.endAngle);
    //                 this.ctx.stroke();
    //                 this.ctx.closePath();
    //             }
    //             else {
    //                 let positions = shape.coordinates;
    //                 let x = positions[0].x;
    //                 let y = positions[1].y;
    //                 for(let i = 1; i < positions.length; i++) {
    //                     this.ctx.beginPath();
    //                     this.ctx.setLineDash([]);
    //                     this.ctx.moveTo(x, y);
    //                     this.ctx.lineTo(positions[i].x, positions[i].y);
    //                     this.ctx.stroke();

    //                     x = positions[i].x;
    //                     y = positions[i].y;
    //                 } 
    //             }
    //         })
    // }

    render() {
           const ctx = this.ctx;

           ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
           ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

           ctx.scale(this.scale, this.scale);

           this.drawShapes();
    }   


    drawShapes() {
        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeRect(
                    shape.start,
                    shape.end,
                    shape.width,
                    shape.height
                );
            }
            else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(
                    shape.x,
                    shape.y,
                    shape.radius,
                    shape.startAngle,
                    shape.endAngle
                );
                this.ctx.stroke();
            }
            else {
                const positions = shape.coordinates;
                for (let i = 1; i < positions.length; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(positions[i - 1].x, positions[i - 1].y);
                    this.ctx.lineTo(positions[i].x, positions[i].y);
                    this.ctx.stroke();
                }
            }
        });
    }


    initMouseHandlers() {
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.canvas.addEventListener("mouseup", this.onMouseUp);
    }

    destroy() {
        this.canvas.removeEventListener("mouseup", this.onMouseUp);
        this.canvas.removeEventListener("mousedown", this.onMouseDown);
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
    }
}