import express, { raw } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { REFRESH_JWT_SECRET, ACCESS_JWT_SECRET } from '@repo/backend-common/config';
import { CreateRoomSchema, SigninUserSchema, SignupUserSchema} from "@repo/common/zod";
import { prismaClient } from '@repo/db/client';
import { protect } from './middlewares/AuthMiddleware';
import bcrypt from 'bcrypt';
import { AuthRequest, Room } from './types';
import cookieParser from "cookie-parser";
import cors from 'cors';
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log(process.env.RESEND_API_KEY);

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

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

    const refreshToken = jwt.sign({userId: user.id}, REFRESH_JWT_SECRET,{
        expiresIn: "7d"
    });

    const accessToken = jwt.sign({userId: user.id}, ACCESS_JWT_SECRET, {
        expiresIn: "24h"
    })

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
      path: "/"
    });

    await prismaClient.session.create({
        data: {
            token: refreshToken,
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        }
    });

    res.status(201).json({
        message: "User is successfully created.",
        token: accessToken
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
        },
        include: {
            room: true,
            adminOf: true
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

    const oldSession = await prismaClient.session.findFirst({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    if(oldSession !== null) {
        await prismaClient.session.update({
            where: {
                id: oldSession.id
            },
            data: {
                revoked: true,
                revokedAt: new Date()
            }
        });
    }

    const refreshToken = jwt.sign({userId:user.id}, REFRESH_JWT_SECRET, {
        expiresIn: '7d'
    });
    
    const accessToken = jwt.sign({userId:user.id}, ACCESS_JWT_SECRET, {
        expiresIn: '24h'
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
        //   secure: true,
        //   sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 24*60*60 * 1000 
    });

    await prismaClient.session.create({
        data: {
            token: refreshToken,
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        }
    });
    res.status(200).json({
        token: accessToken,
        username: user.name,
        email: user.email,
        room: user.room,
        adminOf: user.adminOf
    });
});

app.get("/refresh", async (req:AuthRequest, res) => {

    const token = req.cookies.refresh_token;
    if(!token){
        res.status(401).json({
            message: "Token is invalid"
        })
        return;
    }

    let userId;
    try {
        const decoded = await jwt.verify(token, REFRESH_JWT_SECRET) as JwtPayload;
        userId = decoded.userId;
    }
    catch(ex) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    
    const oldSession = await prismaClient.session.findFirst({
        where: {
            userId,
            token: token
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    
    if(!oldSession) {
        return res.status(401).json({
            message: "failed"
        });
    }
    prismaClient.session.update({
        where: {
            id: oldSession.id
        },
        data: {
            revoked: true,
            revokedAt: new Date()
        }
    });

    if(new Date(oldSession.expiresAt) < new Date() ) {
        
        return res.status(401).json({
            message: "Session expired"
        });
    }

    const refreshToken = jwt.sign({userId}, REFRESH_JWT_SECRET, {
        expiresIn: '7d'
    });
    
    const accessToken = jwt.sign({userId}, ACCESS_JWT_SECRET, {
        expiresIn: '24h'
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
        //   secure: true,
        //   sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 24*60*60 * 1000 
    });

    await prismaClient.session.create({
        data: {
            token: refreshToken,
            userId: userId,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        }
    });

    res.status(200).json({
        token: accessToken
    });
});

app.get("/room/:adminId/:slug", async (req, res) => {
    const adminId = req.params.adminId;
    const slug: string = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug,
            adminId
        }
    });


    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }

    return res.status(200).json(room);
});

app.get("/auth/me", protect, async (req: AuthRequest, res) => {
    const user = await prismaClient.user.findFirst({
        where: {
            id: req.userId
        }
    });

    res.status(200).json({
        user
    });
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

app.get("/chat/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const messages = await prismaClient.message.findMany({
        where: {
            userId: userId,
            roomId: null
        }
    });

    res.status(200).json({
        messages
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

    const hasRoom = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    if(hasRoom) {
        return res.status(400).json({
            message: "Room already exist."
        });
    }
    const room = await prismaClient.room.create({
        data: {
            slug,
            adminId: userId
        }
    });

    res.status(201).json({
        message: "Room is created",
        room
    });
})

app.get("/rooms", async (req, res) => {
    const rooms = await prismaClient.room.findMany({});
    res.status(200).json({
        rooms
    });
});

app.post("/canvas/:userId", async (req, res) => {
    const userId = req.params.userId;
    const canvas  = req.body;
    await prismaClient.message.create({
        data: {
            userId,
            message: JSON.stringify(canvas)
        }
    });

    return res.status(201).json({
        message: "Canvas created"
    })
});

app.post("/logout", async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if(refreshToken === null) {
        return res.status(400).json({
            message: "Something went wrong"
        });
    }

    const decoded = await jwt.verify(refreshToken, REFRESH_JWT_SECRET);
    const userId = (decoded as JwtPayload).userId;

    const session = await prismaClient.session.findFirst({
        where: {
            token: refreshToken
        }
    });

    if(session) {
        session.revoked = true;
    }
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    return res.status(200).json({
        message: "Logout successfully"
    })
})

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await prismaClient.user.findFirst({
        where: {
            email
        }
    });

    console.log(user);

    if(!user) {
        return res.status(400).json({
            message: "User doesn't exist."
        });
    }

    console.log(process.env.GMAIL_USER);
    console.log(process.env.GMAIL_APP_PASSWORD);
    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });


    const rawToken = crypto.randomBytes(32).toString("base64url");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prismaClient.user.update({
        where: {
            id: user.id
        },
        data: {
            passwordResetToken: tokenHash,
            passwordResetExpires: expiresAt
        }
    });

    const resetLink = `http://localhost:3000/reset-password?token=${rawToken}`;

    await transporter.sendMail({
      from: `"Your App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      text: `Reset link: ${resetLink}`
    });

    return res.status(200).json({
        message: "If user exist with this email, link is sent."
    })

})

app.post("/reset-password", async (req, res) => {
    const { token, password} = req.body;

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await prismaClient.user.findFirst({
        where: {
            passwordResetToken: tokenHash,
            passwordResetExpires: {
                gte: new Date(Date.now())
            }
        }
    });

    if(!user) {
        return res.status(400).json({
            message: "Token expired."
        });
    }

    await prismaClient.user.update({
        where: {
            id: user.id
        },
        data: {
            password
        }
    });

    const refreshToken = jwt.sign({userId:user.id}, REFRESH_JWT_SECRET, {
        expiresIn: '7d'
    });
    
    const accessToken = jwt.sign({userId:user.id}, ACCESS_JWT_SECRET, {
        expiresIn: '24h'
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
        //   secure: true,
        //   sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 24*60*60 * 1000 
    });

    await prismaClient.session.create({
        data: {
            token: refreshToken,
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        }
    });

    res.status(200).json({
        token: accessToken,
        username: user.name,
        email: user.email
    });
});


app.listen(3001);