import express from "express";
import mongoose from "mongoose";
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: user 정보
 *     description: 그냥 테스트 API임
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
 *                     example: "users"
 */

const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessNumber: { type: Array, required: false },
  sex: { type: String, required: true, enum: ["male", "female"] },
  residentId: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: {
    type: Object,
    required: true,
    zipcode: { type: String, required: true },
    street: { type: String, required: true },
    detatil: { type: String, required: true },
  },
  signature: { type: String, required: true },
  profile: { type: String },
  bankAccount: {
    type: Object,
    required: true,
    bank: { type: String, required: true },
    account: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resumeIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resumes",
    },
  ],
  scraps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  applies: [
    {
      _id: false,
      postId: mongoose.Schema.Types.ObjectId,
      status: { type: String, enum: ["pending", "accepted", "rejected"] },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});
UsersSchema.index({ name: 1, residentId: 1 }, { unique: true });
const Users = mongoose.model("users", UsersSchema);
export { Users };

// router.post("/", async (req, res) => {
//   try {
//     Users.findOneAndUpdate;
//     const user = await Users.findById(
//       await Users.findById(req.body.userId)
//     ).select(
//       "businessNumber address bankAccount name sex phone signature email residentId profile"
//     );
//     // ).select("businessNumber address bankAccount phone profile");
//     res.status(201).json(user);
//     Users.findByIdAndUpdate(req.body.userId, { ...user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     await Users.findByIdAndUpdate(req.body.userId, req.body.data);
//     res.status(201).end();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const user = await Users.findById(req.query.userId).select(
      "businessNumber address bankAccount name sex phone signature email residentId profile resumeIds scraps applyIds"
    );
    if (user) user["residentId"] = user.residentId.slice(0, 7);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.body.userId, req.body.data);
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.body.userId);
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// const PostSchema = new mongoose.Schema({
//   // _id: String|Number, => MongoDB가 자동으로 생성해줌
//   title: String,
//   summary: String,
//   firstImage: String, // require: true공고 등록시 대표 이미지
//   agentInfo: {
//     // 담당자 정보
//     name: String,
//     email: String,
//     phone: String,
//   },
//   images: [String], // 이미지 URL을 저장하는 배열 // 근무지 이미지
//   companyAddress: {
//     // 회사 주소
//     zcode: String,
//     address: String,
//     detailAddress: String,
//   },
//   exposedArea: {
//     // 광고 노출 지역
//     sido: String,
//     si: String,
//     goo: String,
//   },
//   // 모집 조건
//   // 이거까지 객체로 사용해야 되나???
//   recruitmentEndDate: Date, // 모집 마감일
//   numberOfPeople: Number, // 모집 인원
//   academicAbility: {
//     type: String,
//     // enum: ["학력 무관", "고졸 이상", "대졸 이상", "석사 이상", "박사 이상"],
//     required: true,
//   }, // 학력
//   treatment: String, // 우대 사항
//   // 근무 조건
//   payType: String,
//   pay: Number,
//   payAdditional: String, // 급여관련 추가 설명 저장
//   workNegotiationPeriod: {
//     // 근무 협의 기간
//     startDate: Date,
//     endDate: Date,
//   },
//   workingPeriod: String,
//   // enum: [
//   //   "1년이상",
//   //   "6개월 ~ 1년",
//   //   "3개월 ~ 6개월",
//   //   "1개월 ~ 3개월",
//   //   "1주",
//   //   "1일",
//   // ],
//   // 근무 요일 설정
//   // => workDays, dayNago  이 둘 중 하나의 필드는 무조건 채워져야 함.
//   // 커스텀 유효성 검사 넣어야 됨
//   workingDetail:
//     // 주 몇회인지 설정
//     String,
//   // enum: ["주 1일", "주 2일", "주 3일", "주 4일", "주 5일", "주 6일"],
//   workDays:
//     // 요일 선택 (*)
//     [String],
//   // enum: ["월", "화", "수", "목", "금", "토", "일"],
//   dayNagotiable: Boolean, // 요일 선택 후 추가 협의 가능할 경우
//   dayAdditional: String, // 근무 요일 설명
//   dayNago: Boolean, // 요일 협의 (*)
//   // 근무 시간 설정
//   // => 커스텀 정규화 설정 해야됨
//   // => customTime, timeNago
//   customTime: {
//     // 시간 범위 확인하는 로직 추가하기 (startTime이 endTime보다 나중이 되어서는 안됨)
//     startTime: Date,
//     endTime: Date,
//   },
//   timeNago: Boolean,
//   timeAdd: [String],
//   // enum: ["협의 가능", "로테이션 (교대)", "휴게시간 있음"],
//   timeAdditional: String,
//   // 업직종 (select)
//   jobType: String,
//   // enum: ["초보 가능", "경력자만 가능", "경력자 우대"],
//   jobTypeAdditional: String,
//   employmentType:
//     // 고용 형태 (select)
//     String,
//   // enum: ["일일 근로", "단기 근로", "장기 근로"],
//   benefits: String,
// });

// const Posts = mongoose.model("posts", PostSchema);
