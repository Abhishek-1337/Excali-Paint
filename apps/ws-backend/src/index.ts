import { WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface UserRoomType {
  userId: String,
  rooms: String[],
  ws: WebSocket
}

const userRoom: UserRoomType[] = [];

wss.on('connection', async function connection(ws, request) {
  console.log("request");
  const url = request.url;
  if(!url) {
    ws.close();
    return;
  }

  const params = new URLSearchParams(url?.split("?")[1]);
  const token = params.get("token");
  if(!token){
    ws.close();
    return;
  }

  const decoded = await jwt.verify(token, JWT_SECRET);
  const userId = (decoded as JwtPayload).userId;
  if(!decoded || !userId){
    ws.close();
    return;
  }

  userRoom.push({
    userId,
    rooms: [],
    ws
  });

  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data.toString());
    console.log('received: %s', parsedData);
      if(parsedData.type === "join-room"){
        console.log("joined");
        const user = userRoom.find((ur) => ur.userId == userId);
        user?.rooms.push(parsedData.roomId);
      }

      if(parsedData.type === "leave-room"){
        const user = userRoom.find((ur) => ur.userId == userId);
        if(!user){
          return;
        }

        user.rooms.filter((roomId) => roomId == parsedData.roomId);
      }

      if(parsedData.type === "chat"){
        console.log("chat")
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await prismaClient.message.create({
          data: {
            roomId,
            userId,
            message
          }
        });

        userRoom.forEach((user) => {
          if(user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "chat",
              roomId,
              message
            }));
          }
        })
      }
    }
    );

  ws.send('something');
});