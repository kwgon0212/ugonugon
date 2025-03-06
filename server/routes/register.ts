import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const router = express.Router();

const UserSchema = new mongoose.Schema({
  businessNumber: [String],
  emailCert: Boolean,
  emailCode: Number,
  address: { zipcode: String, street: String, detail: String },
  bankAccount: { bank: String, account: String },
  name: String,
  sex: String,
  residentId: String,
  phone: String,
  signature: String,
  email: String,
  password: String,
});

const User = mongoose.model("user", UserSchema);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: 회원가입 API
 *     description: 사용자 정보를 받아서 새 유저를 등록하는 API입니다. 패스워드는 해시화하고, 서명은 잠시 임시값으로 처리됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               phone:
 *                 type: string
 *                 example: "010-1234-5678"
 *               address:
 *                 type: object
 *                 properties:
 *                   zipcode:
 *                     type: string
 *                     example: "12345"
 *                   street:
 *                     type: string
 *                     example: "서울시 종로구"
 *                   detail:
 *                     type: string
 *                     example: "1층"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               signature:
 *                 type: string
 *                 example: "user-signature"
 *     responses:
 *       201:
 *         description: 회원가입이 성공적으로 완료되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입 성공"
 *       400:
 *         description: 잘못된 요청입니다. 필수 데이터가 누락되었거나 형식이 잘못되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "이메일이 이미 존재합니다."
 */
router.post("/", async (req, res) => {
  const { password, signature, ...userInfo } = req.body;
  console.log(req.body);
  const tempSignature = "@@@";
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    ...userInfo,
    password: hashedPassword,
    signature: tempSignature,
  });

  try {
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(201).json({ message: "회원가입 성공" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
