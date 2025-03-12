import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import { bucket } from "../firebaseAdmin";
import { Users } from "./users";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
