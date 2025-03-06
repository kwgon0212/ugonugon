import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

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
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "인증 실패" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");
    console.log(user);
    if (!user) return res.status(401).json({ error: "유저를 찾을 수 없음" });

    res.json(user); // ✅ 로그인된 유저 정보 반환
  } catch (err) {
    res.status(401).json({ error: "잘못된 토큰" });
  }
});

export default router;
