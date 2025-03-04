import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/test.ts";
import { setupSwagger } from "../swagger/swagger.ts";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";
dotenv.config();

const app: Express = express();
const server = createServer(app);

// CORS 설정을 추가하고 Socket.IO에 적용
const io = new Server(server, {
  cors: {
    origin: "*", // 프로덕션에서는 실제 도메인으로 제한하세요
    methods: ["GET", "POST"],
  },
});

const PORT = 8080;

app.use(cors());
app.use(express.json());
setupSwagger(app);

app.use("/api/test", testRoutes);

// Socket.IO 이벤트 리스너
io.on("connection", (socket) => {
  console.log("사용자 연결됨:", socket.id);

  socket.on("chat message", (msg) => {
    console.log("메시지 수신:", msg);
    // 모든 클라이언트에게 메시지 전송 (송신자 제외)
    socket.broadcast.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("사용자 연결 끊김:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}에서 서버 구동중...`);
});

// 나머지 코드는 그대로 유지...
