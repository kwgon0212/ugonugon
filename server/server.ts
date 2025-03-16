import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.ts";
import scrapRoutes from "./routes/scrap.ts";
import testRoutes from "./routes/test.ts";
import registerRoutes from "./routes/register.ts";
import authRoutes from "./routes/auth.ts";
import postRoutes from "./routes/post.ts";
import contractRoutes from "./routes/contract.ts";
import resumeRoutes from "./routes/resume.ts";
import attendanceRoutes from "./routes/attendance.ts";
import newAttendance from "./routes/newAttendance.ts";
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

//원래 app.listem(PORT,callback)을 사용하면 express가 내부적으로 http.createServer(app)
//를 자동으로 생성하고 실행한다. 즉 express가 http서버 역할을 자동으로 처리해준다.
//하지만 socket.io는 웹소켓 연결을 사용한다. 웹소켓 연결을 시작하기 위해 초기엔
//HTTP 요청(Handshake 과정)을 거쳐야 한다.
//이때 socket.io를 적용하려면 express가 자동으로 생성하는 HTTP서버가 아니라,
//직접 http.createServer()를 호출해서 서버를 만들어야한다.
//app.listen으로 생성된 기본 HTTP서버는 우리가 직접 접근할 수 없기에,
//socket.io를 HTTP서버와 연결할 방법이 없는것이다.
//http.createServer(app)을 사용함으로써 우리가 직접 만든 HTTP 서버를 socket.io에 전달할 수 있다.
const server = createServer(app);

// 소켓 서버 설정
//여기서 server는 HTTP서버이고, new Server(server)를 호출하면
//HTTP서버 위에 socket.io 서버를 생성하는 것이다.
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //프론트엔드에서 접속 허용
    methods: ["GET", "POST"], //허용할 HTTP 메서드 지정
    credentials: true, //인증 정보(쿠키 등) 허용
  },
});

const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// app.use(express.json());
app.use(express.json({ limit: "10mb" })); // JSON 요청 크기 제한 (Base64 이미지 지원)
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);

app.use("/api/users", usersRoutes);
app.use("/api/test", testRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/contract", contractRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/scrap", scrapRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/newAttendance", newAttendance);
app.use("/api/bank", bankRoutes);

app.use("/api/post", postRoutes);
app.use("/api", chatRoutes); // 채팅 관련 라우트를 /api 접두사로 설정

// 기본 라우트
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "root" });
});

// 서버 시작
//서버를 8080에서 실행
server.listen(PORT, async () => {
  try {
    //몽고디비에 연결한다.
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
