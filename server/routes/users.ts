import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessNumber: { type: Array, required: false },
  sex: { type: String, required: true, enum: ["male", "female"] },
  residentId: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: {
    type: Object,
    required: true,
    zipcode: { type: String, required: true },
    street: { type: String, required: true },
    detatil: { type: String, required: true },
  },
  signature: { type: String, required: true },
  profile: { type: String },
  bankAccount: {
    type: Object,
    required: true,
    bank: { type: String, required: true },
    account: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resumeIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resumes",
    },
  ],
  scraps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  applies: [
    {
      _id: false,
      postId: mongoose.Schema.Types.ObjectId,
      status: { type: String, enum: ["pending", "accepted", "rejected"] },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});
UsersSchema.index({ name: 1, residentId: 1 }, { unique: true });
export const Users = mongoose.model("users", UsersSchema);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 사용자 정보 조회
 *     tags: [Users - 사용자 관리]
 *     description: 특정 userId에 대한 사용자 정보를 조회
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 사용자의 ID
 *     responses:
 *       200:
 *         description: "사용자 정보 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "홍길동"
 *                 businessNumber:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["123-45-67890"]
 *                 sex:
 *                   type: string
 *                   enum: ["male", "female"]
 *                   example: "male"
 *                 residentId:
 *                   type: string
 *                   example: "900101-1******"
 *                 phone:
 *                   type: string
 *                   example: "010-1234-5678"
 *                 address:
 *                   type: object
 *                   properties:
 *                     zipcode:
 *                       type: string
 *                       example: "12345"
 *                     street:
 *                       type: string
 *                       example: "서울특별시 강남구 테헤란로"
 *                     detail:
 *                       type: string
 *                       example: "101호"
 *                 signature:
 *                   type: string
 *                   example: "https://example.com/signature.png"
 *                 profile:
 *                   type: string
 *                   example: "https://example.com/profile.jpg"
 *                 bankAccount:
 *                   type: object
 *                   properties:
 *                     bank:
 *                       type: string
 *                       example: "국민은행"
 *                     account:
 *                       type: string
 *                       example: "123-456-78901234"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 resumeIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["65ab12cd34ef56gh78ij90kl"]
 *                 scraps:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["65ab12cd34ef56gh78ij90kl"]
 *                 applies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       postId:
 *                         type: string
 *                         example: "65ab12cd34ef56gh78ij90kl"
 *                       status:
 *                         type: string
 *                         enum: ["pending", "accepted", "rejected"]
 *                         example: "pending"
 *                       appliedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-16T12:00:00Z"
 *       500:
 *         description: "사용자 정보 조회 실패"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch user data"
 */
router.get("/", async (req, res) => {
  try {
    const user = await Users.findById(req.query.userId).select(
      "businessNumber address bankAccount name sex phone signature email residentId profile resumeIds scraps applies"
    );
    if (user) user["residentId"] = user.residentId.slice(0, 7);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: 사용자 정보 수정
 *     tags: [Users - 사용자 관리]
 *     description: 특정 사용자(userId)의 정보를 업데이트
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65ab12cd34ef56gh78ij90kl"
 *               data:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: "010-9876-5432"
 *                   address:
 *                     type: object
 *                     properties:
 *                       zipcode:
 *                         type: string
 *                         example: "54321"
 *                       street:
 *                         type: string
 *                         example: "부산광역시 해운대구"
 *                       detail:
 *                         type: string
 *                         example: "201호"
 *     responses:
 *       201:
 *         description: "사용자 정보 수정 성공"
 *       500:
 *         description: "사용자 정보 수정 실패"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update user data"
 */

router.put("/", async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.body.userId, req.body.data);
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: 사용자 삭제
 *     tags: [Users - 사용자 관리]
 *     description: 특정 사용자(userId)의 계정을 삭제
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65ab12cd34ef56gh78ij90kl"
 *     responses:
 *       201:
 *         description: "사용자 삭제 성공"
 *       500:
 *         description: "사용자 삭제 실패"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete user"
 */
router.delete("/", async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.body.userId);
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
