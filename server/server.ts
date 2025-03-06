import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/test.ts";
import registerRoutes from "./routes/register.ts";
import authRoutes from "./routes/auth.ts";
import emailRoutes from "./routes/email.ts";
import chatRoutes from "./routes/chatServer.ts";
import { setupSwagger } from "../swagger/swagger.ts";
import { Server } from "socket.io";
import { createServer } from "node:http";
import mongoose from "mongoose";
dotenv.config();

const app: Express = express();
const server = createServer(app);
// 소켓 서버 설정
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true, // ✅ 쿠키 허용
  },
});

const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:3000", // ✅ 프론트엔드 도메인 지정
    credentials: true, // ✅ 쿠키 허용
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);

app.use("/api/test", testRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api", chatRoutes); // 채팅 관련 라우트를 /api 접두사로 설정

// 기본 라우트
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "root" });
});

// Socket.IO 연결 처리
io.on("connection", (socket) => {
  console.log("사용자 연결됨:", socket.id);
  socket.on("disconnect", () => {
    console.log("사용자 연결 끊김:", socket.id);
  });
});

// 서버 시작
server.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI as string);
    console.log("MongoDB Connected");

    // 채팅 관련 기능 초기화 (샘플 사용자 생성 등)
    const { initializeChatServer } = require("./routes/chatServer.ts");
    await initializeChatServer();

    console.log(`http://localhost:${PORT}에서 서버 구동중...`);
  } catch (err) {
    console.error("MongoDB 연결 실패:", err);
  }
});

export default app;
