import {  Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESS_JWT_SECRET} from "@repo/backend-common/config";
import { AuthRequest } from '../types';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(401).json({
            message: "Token is invalid."
        });
        return;
    }
    
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        res.status(401).json({
            message: "Token is invalid"
        })
        return;
    }
    const decoded = await jwt.verify(token, ACCESS_JWT_SECRET) as JwtPayload;
    if(!decoded) {
        return res.status(401).json({
            message: "Token is invalid"
        })
    }
    req.userId = decoded.userId;
    next();

}
