import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.ts";
import scrapRoutes from "./routes/scrap.ts";
import registerRoutes from "./routes/register.ts";
import authRoutes from "./routes/auth.ts";
import postRoutes from "./routes/post.ts";
import contractRoutes from "./routes/contract.ts";
import resumeRoutes from "./routes/resume.ts";
import attendanceRoutes from "./routes/attendance.ts";
import bankRoutes from "./routes/bank.ts";
import imageRoutes from "./routes/image.ts";
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
// app.use(express.json());
app.use(express.json({ limit: "10mb" })); // JSON 요청 크기 제한 (Base64 이미지 지원)
app.use(express.urlencoded({ extended: false }));
setupSwagger(app);

app.use("/api/users", usersRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/contract", contractRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/scrap", scrapRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/scrap", scrapRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/bank", bankRoutes);

app.use("/api/post", postRoutes);
app.use("/api", chatRoutes); // 채팅 관련 라우트를 /api 접두사로 설정

// 기본 라우트
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "root" });
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
