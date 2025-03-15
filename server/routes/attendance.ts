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

// 출퇴근 기록 조회
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
