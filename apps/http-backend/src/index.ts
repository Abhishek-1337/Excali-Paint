import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { SignupUserSchema} from "@repo/common/zod";
import { prismaClient } from '@repo/db/client';
import bcrypt from 'bcrypt';

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

    const { username, email, password} = result.data;

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
    const user = prismaClient.user.create({
        data: { username, email, password }
    });

    const token = jwt.sign({id: user.Id}, JWT_SECRET);

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
})

app.get("/create-room", (req, res) => {
    
})


app.listen(3000);