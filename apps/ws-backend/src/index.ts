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

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    const parsedData = JSON.parse(data.toString());
    switch (parsedData) {
      case "join-room": const joinRoom = () => {
        const user = userRoom.find((ur) => ur.userId == userId);
        user?.rooms.push(parsedData.roomId);
      }

      case "leave-room": const leaveRoom = () => {
        const user = userRoom.find((ur) => ur.userId == userId);
        if(!user){
          return;
        }

        user.rooms.filter((roomId) => roomId == parsedData.roomId);
      }

      case "chat": const chat = async () => {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await prismaClient.message.create({
          data: {
            roomId,
            userId
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

  });

  ws.send('something');
});