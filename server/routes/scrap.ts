import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// 스크랩 토글 API
/**
 * @swagger
 * /api/scrap/toggle:
 *   post:
 *     summary: 공고 스크랩 추가/삭제
 *     tags: [Scrap - 스크랩 관리]
 *     description: 사용자가 특정 공고를 스크랩하거나 스크랩을 취소하는 기능
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
 *                 description: 스크랩을 수행하는 사용자 ID
 *               postId:
 *                 type: string
 *                 example: "65cd34ef56gh78ij90kl12ab"
 *                 description: 스크랩할 공고의 ID
 *     responses:
 *       200:
 *         description: "스크랩 추가 또는 삭제 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "스크랩이 추가되었습니다."
 *                 isScraped:
 *                   type: boolean
 *                   example: true
 *                   description: "true이면 스크랩 추가, false이면 스크랩 삭제됨"
 *       400:
 *         description: "잘못된 요청 (userId 또는 postId가 유효하지 않음)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유효하지 않은 사용자 ID입니다."
 *       404:
 *         description: "사용자 또는 공고를 찾을 수 없음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "공고를 찾을 수 없습니다."
 *       500:
 *         description: "서버 내부 오류 발생"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "스크랩 토글 중 오류 발생"
 */
router.post("/toggle", async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // 유효성 검사
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "유효하지 않은 사용자 ID입니다." });
    }

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "유효하지 않은 공고 ID입니다." });
    }

    // 모델 참조 (직접 참조)
    const Users = mongoose.model("users");
    const JobPosting = mongoose.model("JobPosting");

    // 사용자 검색
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 공고 존재 여부 확인
    const post = await JobPosting.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "공고를 찾을 수 없습니다." });
    }

    // ObjectId 타입으로 변환
    const postObjectId = new mongoose.Types.ObjectId(postId);

    // 스크랩 배열에 이미 존재하는지 확인
    const scraps = user.scraps || [];
    const isScraped = scraps.some((id) => id.equals(postObjectId));

    let updateOperation;
    let message;

    if (isScraped) {
      // 스크랩 삭제
      updateOperation = { $pull: { scraps: postObjectId } };
      message = "스크랩이 삭제되었습니다.";
    } else {
      // 스크랩 추가
      updateOperation = { $addToSet: { scraps: postObjectId } };
      message = "스크랩이 추가되었습니다.";
    }

    // 업데이트 진행
    await Users.findByIdAndUpdate(userId, updateOperation);

    res.status(200).json({
      message,
      isScraped: !isScraped,
    });
  } catch (err) {
    console.error("스크랩 토글 에러:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
