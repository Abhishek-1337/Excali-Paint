import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateRoomSchema, SigninUserSchema, SignupUserSchema} from "@repo/common/zod";
import { prismaClient } from '@repo/db/client';
import { protect } from './middlewares/AuthMiddleware';
import bcrypt from 'bcrypt';
import { AuthRequest, Room } from './types';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.post("/signup", async (req, res) => {
    const result = SignupUserSchema.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({
            message: result.error
        });
        return;
    }

    const { name, email, password} = result.data;

    const checkUser = await prismaClient.user.findFirst({
        where: {
            email
        }
    });

    if(checkUser) {
        res.status(400).json({
            message: "There is a user already exist."
        });
        return;
    }

    const hashedPassword = await bcrypt.hash(password as string, 10)
    const user = await prismaClient.user.create({
        data: { name, email, password:hashedPassword }
    });
    console.log(user);

    const token = jwt.sign({userId: user.id}, JWT_SECRET);

    res.status(201).json({
        message: "User is successfully created.",
        token
    });
})

app.post("/signin", async (req, res) => {
    const result = SigninUserSchema.safeParse(req.body);
    if(!result.success) {
        res.status(401).json({
            message: "Invalid login attempt."
        });
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            name: result.data.name
        }
    });
    
    if(!user) {
        res.status(404).json({
            message: "No user found."
        });
        return;
    }
    const isPasswordValid = await bcrypt.compare(result.data.password, user.password);

    if(!isPasswordValid) {
        res.status(401).json({
            message: "Invalid credentials"
        });
        return;
    }

    const token = jwt.sign({userId:user.id}, JWT_SECRET);
    res.status(200).json({
        token
    });
});

app.get("/room/:slug", async (req, res) => {
    const slug: string = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {slug} as any
    });


    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }

    res.status(200).json(room);
});

app.get("/chat/:roomId", async (req, res) => {
    const roomId: number = Number(req.params.roomId);
    const room = await prismaClient.room.findFirst({
        where: {
            id: roomId
        },
        include: {
            messages: true
        }
        
    });

    if(!room) {
        res.status(404).json({
           message: "Room not found." 
        });
        return;
    }

    res.status(200).json({
        messages: room.messages
    });
});

app.post("/create-room", protect, async (req: AuthRequest, res) => {
    const result = CreateRoomSchema.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({
            message: "Invalid input."
        });
        return;
    }

    const { slug } = result.data;
    const userId = req.userId;

    if(!userId) {
        res.status(403).json({
            message: "Invalid token"
        });
        return;
    }
    await prismaClient.room.create({
        data: {
            slug,
            adminId: userId
        }
    });

    res.status(201).json({
        message: "Room is created"
    });
})

app.get("/rooms", async (req, res) => {
    const rooms = await prismaClient.room.findMany({});
    res.status(200).json({
        rooms
    });
});


app.listen(3001);