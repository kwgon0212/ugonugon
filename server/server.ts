import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/test.ts";
import postRoutes from "./routes/post.ts";
import { setupSwagger } from "../swagger/swagger.ts";
import mongoose from "mongoose";
dotenv.config();

const app: Express = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);

app.use("/api/test", testRoutes);
app.use("/api/post", postRoutes);

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_DB_URI as string)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
  console.log(`http://localhost:${PORT}에서 서버 구동중...`);
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: 유저 목록 조회
 *     description: 모든 유저를 조회하는 API
 *     responses:
 *       200:
 *         description: 성공적으로 유저 목록을 반환함
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Jaehyun"
 */
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "root" });
});
