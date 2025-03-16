import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth - 인증]
 *     description: 이메일과 비밀번호를 이용해 로그인하고 JWT 토큰을 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공 (JWT 토큰 반환)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60b6c0f3f72e4a001c8b4567"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       400:
 *         description: 이메일 또는 비밀번호가 올바르지 않음
 *       500:
 *         description: 서버 오류 발생
 */
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
      { id: user._id.toString(), name: user.name },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    res.json({ user: { _id: user._id, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 현재 로그인한 사용자 정보 조회
 *     tags: [Auth - 인증]
 *     description: JWT 토큰을 이용해 로그인된 사용자의 정보를 반환합니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60b6c0f3f72e4a001c8b4567"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 name:
 *                   type: string
 *                   example: "홍길동"
 *       401:
 *         description: 인증 실패 (토큰이 없거나 유효하지 않음)
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 오류 발생
 */
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user)
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });

    res.json({ _id: user._id, email: user.email, name: user.name });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// /**
//  * @swagger
//  * /api/auth/userinfo/{userId}:
//  *   get:
//  *     summary: user의 근로 정보 가져오기
//  *     tags: [Auth - 인증]
//  *     description: user의 근로 현황 보기에 사용됨 / user정보에 저장된 근로(공고id)
//  *     responses:
//  *       200:
//  *         description: 성공적으로 get 완료
//  *         content:
//  *           application/json:
//  *             schema:
//  *                 type: object
//  *                 properties:
//  *                   message:
//  *                     type: string
//  *                     example: "get userInfo success"
//  */
// router.get("/userInfo/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
//     }
//     const info = await User.findById(userId);
//     if (!info) {
//       return res.status(404).json({ message: "근로 정보를 찾을 수 없습니다." });
//     }
//     res.json({ noticeId: info.noticeId, contract: info.contract });
//   } catch (err) {
//     res.status(500).json({ message: "서버 오류" });
//   }
// });

export default router;
