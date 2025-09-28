import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = "Abhishek2000"

const wss = new WebSocketServer({ port: 8080 });

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
  if(!decoded || !(decoded as JwtPayload).userId){
    ws.close();
    return;
  }
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});