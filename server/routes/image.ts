import express from "express";
import multer from "multer";
import sharp from "sharp";
import { bucket } from "../firebaseAdmin";
import { Users } from "./users";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/image/signature:
 *   post:
 *     summary: 사용자 서명 이미지 업로드 API
 *     tags: [Image - 이미지]
 *     description: 사용자의 서명 이미지를 Firebase Storage에 업로드하고, DB에 저장된 서명 URL을 업데이트합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 사용자 ID (MongoDB ObjectId)
 *                 example: "60c72b2f9b1e8a5f3c8b4567"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Base64 인코딩된 서명 이미지 (data:image/webp;base64,....)
 *     responses:
 *       200:
 *         description: 서명 이미지가 성공적으로 업로드됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "업로드 성공"
 *                 url:
 *                   type: string
 *                   example: "https://storage.googleapis.com/bucket-name/signature/userId.webp"
 *       400:
 *         description: 요청 데이터가 부족하거나 잘못된 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "userId와 image(Base64)가 필요합니다."
 *       500:
 *         description: 서버 내부 오류 또는 Firebase 업로드 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류 발생"
 */
router.post("/signature", upload.single("image"), async (req, res) => {
  try {
    const { userId, image } = req.body;

    if (!userId || !image) {
      return res
        .status(400)
        .json({ message: "userId와 image(Base64)가 필요합니다." });
    }

    // 🔥 Base64 -> Buffer 변환
    const base64Data = image.replace(/^data:image\/\w+;base64,/, ""); // Base64 헤더 제거
    const imageBuffer = Buffer.from(base64Data, "base64");

    // 🔥 이미지 압축 (JPEG 80% 품질)
    const compressedImage = await sharp(imageBuffer)
      .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } }) // 🔥 배경 투명
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    const fileName = `signature/${userId}.webp`;
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: { contentType: "image/webp" },
    });

    stream.on("error", (err) => {
      console.error("업로드 실패:", err);
      return res.status(500).json({ message: "업로드 실패" });
    });

    stream.on("finish", async () => {
      await file.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      try {
        await Users.findOneAndUpdate(
          { _id: userId },
          { $set: { signature: imageUrl } },
          { new: true }
        );

        return res.status(200).json({ message: "업로드 성공", url: imageUrl });
      } catch (dbError) {
        console.error("MongoDB 업데이트 실패:", dbError);
        return res
          .status(500)
          .json({ message: "MongoDB 업데이트 실패", error: dbError });
      }
    });

    stream.end(compressedImage);
  } catch (error) {
    console.error("서버 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생", error });
  }
});

export default router;
