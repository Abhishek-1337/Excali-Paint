
export type rect = {
    type: "rect";
    start: number;
    end: number;
    width: number;
    height: number;
};

export type circle = {
    type: "circle",
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
};

export type pen = {
    type: "pen",
    coordinates: {x: number, y: number}[]
}

export type Form = {
    username: string;
    email: string;
    password: string;
}

export type ExistingShapes =  rect | circle | pen; 