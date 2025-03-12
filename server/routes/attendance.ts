import express, { Request, Response } from "express";
import mongoose, { Document, Schema } from "mongoose";
const router = express.Router();

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: 출퇴근 기록 정보
 *     description: 출퇴근 관리를 위한 API
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
 *                     example: "attendance"
 */

// 출퇴근 기록 인터페이스 정의
interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  noticeId: mongoose.Types.ObjectId;
  checkInTime: Date;
  checkOutTime?: Date;
  status: "checked-in" | "checked-out" | "completed";
  location?: {
    checkIn?: {
      latitude: number;
      longitude: number;
    };
    checkOut?: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// 출퇴근 기록 스키마 정의
const AttendanceSchema = new Schema<IAttendance>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  noticeId: {
    type: Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  checkInTime: {
    type: Date,
    required: true,
  },
  checkOutTime: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["checked-in", "checked-out", "completed"],
    default: "checked-in",
  },
  location: {
    checkIn: {
      latitude: Number,
      longitude: Number,
    },
    checkOut: {
      latitude: Number,
      longitude: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 복합 인덱스 생성 (한 사용자가 같은 근무에 중복 출근을 방지)
AttendanceSchema.index(
  { userId: 1, noticeId: 1, checkInTime: 1 },
  { unique: true }
);

const Attendance = mongoose.model<IAttendance>("attendance", AttendanceSchema);

// 요청 타입 정의
interface CheckInRequest {
  userId: string;
  noticeId: string;
  checkInTime?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface CheckOutRequest {
  userId: string;
  noticeId: string;
  checkOutTime?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface StatusQueryParams {
  userId: string;
  noticeIds?: string;
}

interface HistoryQueryParams {
  userId: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}

interface StatsQueryParams {
  userId: string;
  period?: "week" | "month" | "year";
}

/**
 * @swagger
 * /api/attendance/check-in:
 *   post:
 *     summary: 출근 처리 API
 *     description: 사용자의 출근 시간 및 위치 기록
 *     responses:
 *       201:
 *         description: 성공적으로 출근 처리
 */
router.post(
  "/check-in",
  async (req: Request<{}, {}, CheckInRequest>, res: Response) => {
    try {
      const { userId, noticeId, checkInTime, location } = req.body;

      // 필수 데이터 확인
      if (!userId || !noticeId) {
        return res
          .status(400)
          .json({ error: "사용자 ID와 근무 ID가 필요합니다." });
      }

      // 이미 출근한 기록이 있는지 확인 (오늘 날짜 기준)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingRecord = await Attendance.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        noticeId: new mongoose.Types.ObjectId(noticeId),
        checkInTime: { $gte: today, $lt: tomorrow },
        status: { $in: ["checked-in", "checked-out"] },
      });

      if (existingRecord) {
        return res.status(400).json({
          error: "이미 오늘 출근 처리가 되어있습니다.",
          attendance: existingRecord,
        });
      }

      // 새 출근 기록 생성
      const attendance = new Attendance({
        userId: new mongoose.Types.ObjectId(userId),
        noticeId: new mongoose.Types.ObjectId(noticeId),
        checkInTime: checkInTime ? new Date(checkInTime) : new Date(),
        status: "checked-in",
        location: location ? { checkIn: location } : undefined,
      });

      await attendance.save();

      res.status(201).json({
        message: "출근 처리가 완료되었습니다.",
        attendance,
      });
    } catch (err: any) {
      console.error("출근 처리 오류:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /api/attendance/check-out:
 *   post:
 *     summary: 퇴근 처리 API
 *     description: 사용자의 퇴근 시간 및 위치 기록
 *     responses:
 *       200:
 *         description: 성공적으로 퇴근 처리
 */
router.post(
  "/check-out",
  async (req: Request<{}, {}, CheckOutRequest>, res: Response) => {
    try {
      const { userId, noticeId, checkOutTime, location } = req.body;

      // 필수 데이터 확인
      if (!userId || !noticeId) {
        return res
          .status(400)
          .json({ error: "사용자 ID와 근무 ID가 필요합니다." });
      }

      // 오늘 출근 기록 찾기
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const attendance = await Attendance.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        noticeId: new mongoose.Types.ObjectId(noticeId),
        checkInTime: { $gte: today, $lt: tomorrow },
        status: "checked-in",
      });

      if (!attendance) {
        return res
          .status(404)
          .json({ error: "출근 기록이 없습니다. 먼저 출근 처리해주세요." });
      }

      // 퇴근 시간 설정
      const checkOut = checkOutTime ? new Date(checkOutTime) : new Date();

      // 퇴근 정보 업데이트
      attendance.checkOutTime = checkOut;
      attendance.status = "checked-out";
      attendance.updatedAt = new Date();

      if (location) {
        attendance.location = {
          ...attendance.location,
          checkOut: location,
        };
      }

      await attendance.save();

      res.status(200).json({
        message: "퇴근 처리가 완료되었습니다.",
        attendance,
      });
    } catch (err: any) {
      console.error("퇴근 처리 오류:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /api/attendance/status:
 *   get:
 *     summary: 출퇴근 상태 조회 API
 *     description: 특정 근무 또는 사용자의 출퇴근 상태 조회
 *     responses:
 *       200:
 *         description: 성공적으로 상태 정보 반환
 */
router.get(
  "/status",
  async (req: Request<{}, {}, {}, StatusQueryParams>, res: Response) => {
    try {
      const { userId, noticeIds } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "사용자 ID가 필요합니다." });
      }

      let query: any = { userId: new mongoose.Types.ObjectId(userId) };

      // 특정 공고 ID들이 제공된 경우
      if (noticeIds) {
        const idsArray = noticeIds.split(",");
        query.noticeId = {
          $in: idsArray.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }

      // 최근 1주일 이내 기록만 조회
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      query.checkInTime = { $gte: oneWeekAgo };

      const attendanceRecords = await Attendance.find(query)
        .sort({ checkInTime: -1 }) // 최신 기록 먼저
        .limit(50); // 최대 50개 기록

      res.status(200).json(attendanceRecords);
    } catch (err: any) {
      console.error("상태 조회 오류:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /api/attendance/history:
 *   get:
 *     summary: 출퇴근 기록 조회 API
 *     description: 특정 사용자의 근무 기록 이력 조회
 *     responses:
 *       200:
 *         description: 성공적으로 기록 정보 반환
 */
router.get(
  "/history",
  async (req: Request<{}, {}, {}, HistoryQueryParams>, res: Response) => {
    try {
      const {
        userId,
        startDate,
        endDate,
        page = "1",
        limit = "10",
      } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "사용자 ID가 필요합니다." });
      }

      let query: any = { userId: new mongoose.Types.ObjectId(userId) };

      // 날짜 범위가 제공된 경우
      if (startDate && endDate) {
        query.checkInTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // 페이지네이션 계산
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // 이력 조회 (페이지네이션 적용)
      const attendanceRecords = await Attendance.find(query)
        .sort({ checkInTime: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("noticeId", "title payType pay"); // 공고 정보 포함

      // 전체 기록 수 조회
      const total = await Attendance.countDocuments(query);

      res.status(200).json({
        records: attendanceRecords,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (err: any) {
      console.error("이력 조회 오류:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /api/attendance/{id}:
 *   get:
 *     summary: 특정 출퇴근 기록 조회 API
 *     description: 특정 ID의 출퇴근 기록 상세 조회
 *     responses:
 *       200:
 *         description: 성공적으로 기록 상세 정보 반환
 */
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findById(id)
      .populate("userId", "name email phone")
      .populate("noticeId", "title payType pay");

    if (!attendance) {
      return res.status(404).json({ error: "해당 기록을 찾을 수 없습니다." });
    }

    res.status(200).json(attendance);
  } catch (err: any) {
    console.error("기록 조회 오류:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/attendance/stats/user:
 *   get:
 *     summary: 근무 통계 API
 *     description: 사용자의 근무 시간 통계 정보 조회
 *     responses:
 *       200:
 *         description: 성공적으로 통계 정보 반환
 */
router.get(
  "/stats/user",
  async (req: Request<{}, {}, {}, StatsQueryParams>, res: Response) => {
    try {
      const { userId, period } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "사용자 ID가 필요합니다." });
      }

      // 기간 설정
      let startDate = new Date();
      const endDate = new Date();

      switch (period) {
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 1); // 기본값: 1개월
      }

      // 해당 기간의 모든 출퇴근 기록 조회
      const attendanceRecords = await Attendance.find({
        userId: new mongoose.Types.ObjectId(userId),
        checkInTime: { $gte: startDate, $lte: endDate },
        status: { $in: ["checked-out", "completed"] },
      });

      // 통계 계산 - 총 근무 시간 계산 (각 출퇴근 기록별 시간 계산)
      let totalMinutes = 0;

      attendanceRecords.forEach((record) => {
        if (record.checkInTime && record.checkOutTime) {
          const diffMs =
            record.checkOutTime.getTime() - record.checkInTime.getTime();
          const diffMinutes = Math.floor(diffMs / 60000); // 밀리초를 분으로 변환
          totalMinutes += diffMinutes;
        }
      });

      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;

      const recordsCount = attendanceRecords.length;
      const avgDuration =
        recordsCount > 0 ? Math.round(totalMinutes / recordsCount) : 0;

      res.status(200).json({
        period: {
          start: startDate,
          end: endDate,
        },
        stats: {
          totalWorkDuration: `${totalHours}시간 ${remainingMinutes}분`,
          totalMinutes,
          recordsCount,
          averageWorkDuration: `${Math.floor(avgDuration / 60)}시간 ${
            avgDuration % 60
          }분`,
        },
      });
    } catch (err: any) {
      console.error("통계 조회 오류:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
