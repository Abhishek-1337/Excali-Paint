import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateRoomSchema, SignupUserSchema} from "@repo/common/zod";
import { prismaClient } from '@repo/db/client';
import { protect } from './middlewares/AuthMiddleware';
import bcrypt from 'bcrypt';
import { AuthRequest } from './types';

const app = express();

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

app.post("/signin", (req, res) => {
    const userId = 1;
    const token = jwt.sign({userId}, JWT_SECRET);
    res.status(200).json({
        token
    });
});

app.get("/room/:slug", async (req, res) => {
    const slug: string = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {slug} as any
    });

    console.log(room);

    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }

    res.status(200).json(room);
})

// app.get("/create-room", protect, async (req: AuthRequest, res) => {
//     const result = CreateRoomSchema.safeParse(req.body);
//     if(!result.success) {
//         res.status(400).json({
//             message: "Invalid input."
//         });
//         return;
//     }

//     const { name } = result.data;
//     const userId = req.userId;
//     await prismaClient.room.create({
//         data: {
//             adminId: userId
//         }
//     });

//     res.status(201).json({
//         message: "Room is created"
//     });
// })


app.listen(3000);