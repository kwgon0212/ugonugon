import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  postId: {
    type: mongoose.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["checked-in", "checked-out", "completed", "paid"],
    default: "checked-in",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

/**
 * @swagger
 * tags:
 *   name: Attendance - 출퇴근 기록
 *   description: 출퇴근 기록 관리 API
 */

// 출퇴근 기록 조회
/**
 * @swagger
 * /api/attendance/check:
 *   post:
 *     summary: 출퇴근 기록 조회 API
 *     tags: [Attendance - 출퇴근 기록]
 *     description: 특정 사용자(userId)의 지정된 공고(postIds)에 대한 출퇴근 기록 조회
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6523abf3e8f1b2e4c8c8b7e4", "6523ac23e8f1b2e4c8c8b7e5"]
 *               userId:
 *                 type: string
 *                 example: "60d9f2b68a9e2b001c8e4f3a"
 *     responses:
 *       200:
 *         description: "출퇴근 기록 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   postId:
 *                     type: string
 *                     example: "6523abf3e8f1b2e4c8c8b7e4"
 *                   checkInTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-15T08:30:00Z"
 *                   checkOutTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-15T18:00:00Z"
 *                   status:
 *                     type: string
 *                     enum: ["checked-in", "completed", "paid"]
 *                     example: "completed"
 *       500:
 *         description: "출퇴근 기록 조회 실패"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch attendance records"
 */
router.post("/check", async (req, res) => {
  try {
    const { postIds, userId } = req.body;
    const attendances = await Attendance.find({
      userId,
      postId: { $in: postIds },
    });
    const attendanceMap = attendances.reduce((acc, att) => {
      acc[att.postId.toString()] = att;
      return acc;
    }, {});
    res.json(attendanceMap);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

/**
 * @swagger
 * /api/attendance/save:
 *   post:
 *     summary: 출퇴근 기록 저장 API
 *     tags: [Attendance - 출퇴근 기록]
 *     description: 사용자의 출근 또는 퇴근 시간을 기록
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d9f2b68a9e2b001c8e4f3a"
 *               postId:
 *                 type: string
 *                 example: "6523abf3e8f1b2e4c8c8b7e4"
 *               type:
 *                 type: string
 *                 enum: ["check-in", "check-out"]
 *                 example: "check-in"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-15T08:30:00Z"
 *     responses:
 *       200:
 *         description: "출퇴근 기록이 저장됨"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "출근 기록이 저장되었습니다."
 *                 attendance:
 *                   type: object
 *                   properties:
 *                     checkInTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T08:30:00Z"
 *                     checkOutTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T18:00:00Z"
 *                     status:
 *                       type: string
 *                       enum: ["checked-in", "completed", "paid"]
 *                       example: "checked-in"
 *       500:
 *         description: "출퇴근 기록 저장 실패"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to save attendance log"
 */
router.post("/save", async (req, res) => {
  try {
    const { userId, postId, type, timestamp } = req.body;

    let attendance = await Attendance.findOne({ userId, postId });

    if (!attendance) {
      attendance = new Attendance({
        userId,
        postId,
        checkInTime: null,
        checkOutTime: null,
        status: "checked-in",
      });
    }

    if (type === "check-in") {
      attendance.checkInTime = timestamp;
      attendance.status = "checked-in";
    } else if (type === "check-out") {
      attendance.checkOutTime = timestamp;
      attendance.status = "completed"; // ✅ 여기서 명확히 상태 업데이트
    }

    // attendance.updatedAt = new Date();

    // ✅ `new: true` 옵션을 추가해 findOneAndUpdate 사용 (더 안정적인 방법)
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { userId, postId },
      {
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        status: attendance.status,
        // updatedAt: attendance.updatedAt,
      },
      { new: true, upsert: true } // ✅ 없으면 새로 생성 (upsert: true)
    );

    console.log("Updated Attendance:", updatedAttendance);

    res.json({
      message: `${
        type === "check-in" ? "출근" : "퇴근"
      } 기록이 저장되었습니다.`,
      attendance: updatedAttendance, // ✅ 응답에서 갱신된 데이터 반환
    });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance log" });
  }
});

/**
 * @swagger
 * /api/attendance/pay:
 *   post:
 *     summary: 정산 처리 API
 *     tags: [Attendance - 출퇴근 기록]
 *     description: 특정 사용자의 특정 공고(postId)에 대한 정산 완료 처리
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d9f2b68a9e2b001c8e4f3a"
 *               postId:
 *                 type: string
 *                 example: "6523abf3e8f1b2e4c8c8b7e4"
 *     responses:
 *       200:
 *         description: "정산 내역이 저장됨"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "정산 내역이 저장되었습니다."
 *                 attendance:
 *                   type: object
 *                   properties:
 *                     checkInTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T08:30:00Z"
 *                     checkOutTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T18:00:00Z"
 *                     status:
 *                       type: string
 *                       enum: ["checked-in", "completed", "paid"]
 *                       example: "paid"
 *       500:
 *         description: "정산 내역 저장 실패"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to save attendance log"
 */
router.post("/pay", async (req, res) => {
  try {
    const { userId, postId } = req.body;

    let attendance = await Attendance.findOne({ userId, postId });
    if (!attendance) return;

    attendance.status = "paid";

    // ✅ `new: true` 옵션을 추가해 findOneAndUpdate 사용 (더 안정적인 방법)
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { userId, postId },
      {
        status: attendance.status,
      }
    );

    res.json({
      message: "정산 내역이 저장되었습니다.",
      attendance: updatedAttendance, // ✅ 응답에서 갱신된 데이터 반환
    });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance log" });
  }
});

export default router;
