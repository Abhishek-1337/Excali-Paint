import { Request } from 'express';

type Custom = {
    userId: string;
}

export type AuthRequest = Custom & Request;