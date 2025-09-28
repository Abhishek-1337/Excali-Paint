import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

const app = express();

app.use(express.json());

app.post("/signup", (req, res) => {
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