import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// 간단한 테스트 엔드포인트
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Scrap router is working" });
});

// 스크랩 토글 API
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
