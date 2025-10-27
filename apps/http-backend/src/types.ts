import { Request } from 'express';

export interface AuthRequest extends Request {
    userId?: string;
}

export type Message = {
    id: number,
    message: string,
    roomId: string,
    userId: string
}

export type Room = {
    id: number,
    slug: string,
    adminId: string,
    messages: Message[]
}