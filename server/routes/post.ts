import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const { Schema } = mongoose;

/**
 * @swagger
 * /postApi/test/posts:
 *   get:
 *     summary: post전용 테스트 API
 *     description: 그냥 post의 테스트 API임
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
router.get("/posts", (req, res) => {
  res.status(200).json({ message: "test" });
});

// 공고 스키마
const PostSchema = new Schema(
  {
    // _id: String|Number, => MongoDB가 자동으로 생성해줌
    title: { type: String, require: true },
    summary: { type: String, require: true },
    representativeImage: String, // 공고 등록시 대표 이미지
    agentInfo: [
      // 담당자 정보
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
      },
    ],
    images: [{ type: String }], // 이미지 URL을 저장하는 배열 // 근무지 이미지
    companyAddress: [
      {
        zcode: { type: String, require: true },
        address: { type: String, require: true },
        detailAddress: { type: String, require: true },
      },
    ],
    exposedArea: [
      {
        si: { type: String, require: true },
        goon: { type: String, require: true },
        goo: { type: String, require: true },
      },
    ],
    endDate: { type: Date, require: true },
    cnt: { type: Number, require: true },
  },
  { collection: "posts" } // 컬렉션 이름 강제 지정
);

export default router;
