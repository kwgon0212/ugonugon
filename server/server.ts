import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/test.ts";
dotenv.config();

const app: Express = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/api/test", testRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}에서 서버 구동중...`);
});

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "root" });
});
