import { timeStamp } from "console";
import express from "express";
import mongoose from "mongoose";
const router = express.Router();

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: resume 열람람
 *     description: 관리, 공고 지원, 지원자 열람에 사용
 *     responses:
 *       200:
 *         description: 성공적으로 값 반환
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Resumes"
 *   post:
 *     summary: resum 등록
 *     description: 이력서 등록
 *     responses:
 *       200:
 *         description: 성공적으로 값 등록
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Resumes"
 */

const ResumesSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "users" },
  title: { type: String, required: true },
  name: { type: String, required: true },
  sex: { type: String, required: true },
  residentId: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  school: { type: String, required: true },
  schoolState: { type: String, required: true },
  careers: [
    {
      company: { type: String, required: true },
      dates: { type: String, required: true },
      careerDetail: { type: String, required: true },
      _id: false,
    },
  ],
  introduction: { type: String, required: true },
  writtenDay: { type: String, required: true },
  // writtenDay: { type: Date, require: true },
  applyIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  // applis: [{type: mongoose.Types.ObjectId, ref: "posts", require: false}],
});
const Resumes = mongoose.model("resumes", ResumesSchema);

router.get("/", async (req, res) => {
  try {
    const resume = await Resumes.findById(req.query.resumeId);
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const resume = new Resumes(req.body.data);
    const newResume = await resume.save();
    res.status(200).json(newResume._id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  await Resumes.findByIdAndUpdate(req.body.resumeId, req.body.data);
  try {
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Resumes.findByIdAndDelete(req.body.resumeId);
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:resumeId", async (req, res) => {
  try {
    // const resume = await Resumes.findById(req.query.resumeId);
    const resume = await Resumes.findById(req.params.resumeId);
    return res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
