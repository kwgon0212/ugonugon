import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: user 정보
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
 *                     example: "users"
 */

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
const Users = mongoose.model("users", UsersSchema);
export { Users };

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

router.put("/", async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.body.userId, req.body.data);
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.body.userId);
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
