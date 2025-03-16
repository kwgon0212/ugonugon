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
  profile: { type: String },
  name: { type: String, required: true },
  sex: { type: String, required: true },
  residentId: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  addressDetail: { type: String },
  school: { type: String, required: true },
  schoolState: { type: String, required: true },
  careers: [
    {
      company: { type: String },
      dates: { type: String },
      careerDetail: { type: String },
      _id: false,
    },
  ],
  introduction: { type: String },
  writtenDay: { type: String, required: true },
  applyIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  // applis: [{type: mongoose.Types.ObjectId, ref: "posts", require: false}],
});
const Resumes = mongoose.model("resumes", ResumesSchema);

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: 특정 이력서 조회
 *     tags: [Resumes - 이력서 관리]
 *     description: 특정 resumeId에 해당하는 이력서를 조회하는 API
 *     parameters:
 *       - in: query
 *         name: resumeId
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 이력서 ID
 *     responses:
 *       200:
 *         description: 성공적으로 이력서를 조회함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65cd34ef56gh78ij90kl12ab"
 *                 title:
 *                   type: string
 *                   example: "프론트엔드 개발자 지원서"
 *                 name:
 *                   type: string
 *                   example: "홍길동"
 *                 email:
 *                   type: string
 *                   example: "test@example.com"
 *       400:
 *         description: 이력서 ID가 유효하지 않음
 *       500:
 *         description: 서버 오류 발생
 *
 *   post:
 *     summary: 새로운 이력서 등록
 *     tags: [Resumes - 이력서 관리]
 *     description: 사용자가 새 이력서를 등록하는 API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "65ab12cd34ef56gh78ij90kl"
 *                   title:
 *                     type: string
 *                     example: "프론트엔드 개발자 지원서"
 *                   email:
 *                     type: string
 *                     example: "test@example.com"
 *     responses:
 *       200:
 *         description: 이력서가 성공적으로 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumeId:
 *                   type: string
 *                   example: "65cd34ef56gh78ij90kl12ab"
 *       500:
 *         description: 서버 오류 발생
 *
 *   put:
 *     summary: 기존 이력서 수정
 *     tags: [Resumes - 이력서 관리]
 *     description: 특정 이력서를 업데이트하는 API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeId:
 *                 type: string
 *                 example: "65cd34ef56gh78ij90kl12ab"
 *               data:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "백엔드 개발자 지원서"
 *     responses:
 *       201:
 *         description: 이력서가 성공적으로 수정됨
 *       500:
 *         description: 서버 오류 발생
 *
 *   delete:
 *     summary: 이력서 삭제
 *     tags: [Resumes - 이력서 관리]
 *     description: 특정 이력서를 삭제하는 API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeId:
 *                 type: string
 *                 example: "65cd34ef56gh78ij90kl12ab"
 *     responses:
 *       201:
 *         description: 이력서가 성공적으로 삭제됨
 *       500:
 *         description: 서버 오류 발생
 */

/**
 * @swagger
 * /api/resume/{resumeId}:
 *   get:
 *     summary: 개별 이력서 조회
 *     tags: [Resumes - 이력서 관리]
 *     description: 특정 resumeId에 해당하는 이력서를 조회하는 API
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 이력서 ID
 *     responses:
 *       200:
 *         description: 성공적으로 이력서를 조회함
 *       500:
 *         description: 서버 오류 발생
 */

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
    const resume = await Resumes.findById(req.params.resumeId);
    return res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
