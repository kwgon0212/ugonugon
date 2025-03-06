import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);
/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: 테스트 API
 *     description: 그냥 테스트 API임
 *     responses:
 *       200:
 *         description: 성공적으로 message 반환
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "test"
 */
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(401).json({ error: "이메일이 존재하지 않습니다." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ error: "비밀번호가 틀렸습니다." });

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  res
    .cookie("token", token, { httpOnly: true, sameSite: "strict" })
    .json({ message: "로그인 성공!" });
});

export default router;
