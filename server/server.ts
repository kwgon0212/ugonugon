import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

import testRoutes from "./routes/test.ts";
import registerRoutes from "./routes/register.ts";
import authRoutes from "./routes/auth.ts";
import postRoutes from "./routes/post.ts";

import emailRoutes from "./routes/email.ts";
import { setupSwagger } from "../swagger/swagger.ts";
import mongoose from "mongoose";
dotenv.config();

const app: Express = express();
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

app.use("/api/post", postRoutes);

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_DB_URI as string)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
  console.log(`http://localhost:${PORT}에서 서버 구동중...`);
});
