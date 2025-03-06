import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// 로그인 API
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.json({ user: { _id: user._id, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user)
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });

    res.json({ _id: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;
