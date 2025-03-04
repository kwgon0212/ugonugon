import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/test.ts";
import { setupSwagger } from "../swagger/swagger.ts";
import mongoose from "mongoose";
dotenv.config();

const app: Express = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);

app.use("/api/test", testRoutes);

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_DB_URI as string)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
  console.log(`http://localhost:${PORT}에서 서버 구동중...`);
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessNumber: { type: Array, required: false },
  sex: { type: String, required: true },
  residentId: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    type: Object,
    required: true,
    zipcode: { type: String, required: true },
    street: { type: String, required: true },
    detatil: { type: String, required: true },
  },
  signature: { type: String, required: true },
  bankInfo: {
    type: Object,
    required: true,
    bank: { type: String, required: true },
    account: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

mongoose.model("user", UserSchema);
console.log("============");

console.log(mongoose.modelNames());

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
