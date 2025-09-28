import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { AuthRequest } from '../types';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(403).json({
            message: "Token is invalid."
        });
        return;
    }
    
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        res.status(403).json({
            message: "Token is invalid"
        })
        return;
    }
    const decoded = await jwt.verify(token, JWT_SECRET) as JwtPayload;
    if(!decoded) {
        return res.status(403).json({
            message: "Token is invalid"
        })
    }
    req.userId = decoded.userId;
    next();

}