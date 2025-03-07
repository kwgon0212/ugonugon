import { error, log } from "console";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const { Schema } = mongoose;

// 공고 스키마 - 수정 전 입니다. 건들 ㄴㄴ
// const PostSchema = new Schema(
//   // _id: String|Number, => MongoDB가 자동으로 생성해줌
//   {
//     writter: { type: String, required: true }, // 공고 작성한 userId

//     applicantInfo: [
//       // 지원자 정보
//       {
//         applicantId: { type: String, required: true },
//         resume: { type: String, required: true },
//         introduction: { type: String, required: true },
//       },
//     ],
//     hiredCandidatesInfo: [
//       // 채용된 사람
//       {
//         hiredId: { type: String, required: true },
//         resume: { type: String, required: true },
//         introduction: { type: String, required: true },
//       },
//     ],
//     reviewInfo: [
//       {
//         // 리뷰 정보
//         rating: { type: Number, required: true, min: 0, max: 5 }, // 별점
//         content: { type: String }, // 리뷰 내용
//         reviewAuthor: { type: String, required: true }, // 리뷰 작성자
//       },
//     ],
//     postDate: { type: Date, required: true }, // 공고 등록한 날짜
//     title: { type: String, required: true },
//     endOfNotice: { type: Date, required: true }, // 공고 마감일
//     summary: { type: String, required: true },
//     firstImage: { type: String, required: true }, // require: true공고 등록시 대표 이미지
//     agentInfo: {
//       // 담당자 정보
//       name: { type: String, required: true },
//       email: { type: String, required: true },
//       phone: { type: String, required: true },
//     },
//     images: [{ type: String }], // 이미지 URL을 저장하는 배열 // 근무지 이미지

//     // 모집 조건
//     recruitmentEndDate: { type: Date, required: true }, // 모집 마감일
//     numberOfPeople: { type: Number, required: true }, // 모집 인원
//     academicAbility: {
//       type: String,
//       enum: ["학력 무관", "고졸 이상", "대졸 이상", "석사 이상", "박사 이상"],
//       required: true,
//     }, // 학력
//     treatment: { type: String }, // 우대 사항

//     // 근무 조건
//     payType: { type: String, required: true },
//     pay: { type: Number, required: true },
//     payAdditional: { type: String }, // 급여관련 추가 설명 저장
//     workNegotiationPeriod: {
//       // 근무 협의 기간
//       startDate: { type: Date, required: true },
//       endDate: { type: Date, required: true },
//     },
//     // 근무 기간
//     workingPeriod: {
//       type: String,
//       enum: [
//         "1년이상",
//         "6개월 ~ 1년",
//         "3개월 ~ 6개월",
//         "1개월 ~ 3개월",
//         "1주",
//         "1일",
//       ],
//       required: true,
//     },
//     // 근무 날짜
//     workDate: { type: Date },

//     // 근무 요일 설정
//     workingDetail: {
//       // 주 몇회인지 설정
//       type: String,
//       enum: ["주 1일", "주 2일", "주 3일", "주 4일", "주 5일", "주 6일"],
//       required: true,
//     },
//     workDays: {
//       // 요일 선택 (*)
//       type: [String],
//       enum: ["월", "화", "수", "목", "금", "토", "일"],
//     },

//     dayNagotiable: { type: Boolean, default: false }, // 요일 선택 후 추가 협의 가능할 경우
//     dayAdditional: { type: String }, // 근무 요일 설명
//     dayNago: { type: Boolean, default: false }, // 요일 협의 (*)

//     // 근무 시간 설정
//     customTime: {
//       // 시간 범위 확인하는 로직 추가하기 (startTime이 endTime보다 나중이 되어서는 안됨)
//       startTime: { type: Date },
//       endTime: { type: Date },
//     },
//     timeNago: { type: Boolean, default: false },
//     timeAdd: {
//       type: [String],
//       enum: ["협의 가능", "로테이션 (교대)", "휴게시간 있음", "재택근무 가능"],
//       required: false,
//     },
//     timeAdditional: { type: String, required: true },

//     // 업직종 (select)
//     jobType: {
//       type: String,
//       enum: ["초보 가능", "경력자만 가능", "경력자 우대"],
//       required: true,
//     },
//     jobTypeAdditional: { type: String, required: true },

//     employmentType: {
//       // 고용 형태 (select)
//       type: String,
//       enum: ["일일 근로", "단기 근로", "장기 근로", "정규직"],
//       required: true,
//     },
//     benefits: { type: String },

//     // 회사 정보
//     companyName: { type: String, required: true }, // 회사 이름
//     // 회사 주소
//     companyAddress: {
//       zcode: { type: String, required: true },
//       address: { type: String, required: true },
//       detailAddress: { type: String, required: true },
//       // 주소를 좌표로 변환해서 저장
//       Latitude: { type: String, required: true }, // 위도
//       Longitude: { type: String, required: true }, // 경도
//     },
//     exposedArea: {
//       // 광고 노출 지역
//       sido: { type: String, required: true },
//       si: { type: String, required: true },
//       goo: { type: String, required: true },
//     },
//   },
//   { collection: "posts" } // 컬렉션 이름 강제 지정
// );

// 몽고DB 도큐먼트 객체
// const Post = mongoose.model("Post", PostSchema);

// 수정 된 공고 스키마 입니다. 이거 기반으로 사용하시면 됩니다.
// 급여 (Pay)
const PaySchema = new Schema({
  type: { type: String, required: true, default: "시급" }, // 급여 유형 (ex. 시급, 월급)
  value: { type: Number, required: true, default: 0 }, // 급여 금액
});

// 기간 (PeriodTime, WorkTime, RestTime)
const TimeSchema = new Schema({
  start: { type: Date, required: true, default: Date.now },
  end: { type: Date, required: true, default: Date.now },
  discussion: { type: Boolean, default: false }, // 협의 여부
});

// 마감 시간 (DeadLineTime)
const DeadlineSchema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  time: { type: Date, required: true, default: Date.now },
});

// 학력 (Education)
const EducationSchema = new Schema({
  school: { type: String, required: true, default: "무관" }, // 학력 (무관, 고졸, 대졸 등)
  state: { type: String, default: "" }, // 학교 상태 (졸업, 재학 중 등)
});

// 주소 (Address)
const AddressSchema = new Schema({
  zipcode: { type: String, required: true }, // 우편번호
  street: { type: String, required: true }, // 도로명 주소
  detail: { type: String, required: true }, // 상세 주소
});

// 채용 담당자 (Recruiter)
const RecruiterSchema = new Schema({
  name: { type: String, required: true }, // 담당자 이름
  email: { type: String, required: true }, // 이메일
  phone: { type: String, required: true }, // 연락처
});

// 채용 공고 (JobPosting)
const JobPostingSchema = new Schema({
  jobType: { type: String, required: true }, // 직종
  pay: { type: PaySchema, required: true }, // 급여
  hireType: { type: [String], required: true, default: ["일일"] }, // 고용 형태 (ex. 정규직, 계약직 등)
  period: { type: TimeSchema, required: true }, // 근무 기간
  hour: { type: TimeSchema, required: true }, // 근무 시간
  restTime: { type: TimeSchema, required: true }, // 휴식 시간
  day: { type: [String], required: true, default: ["월"] }, // 근무 요일 (월~일)
  workDetail: { type: String, default: "" }, // 업무 상세 내용
  welfare: { type: String, default: "" }, // 복리후생
  postDetail: { type: String, default: "" }, // 공고 상세 설명
  deadline: { type: DeadlineSchema, required: true }, // 모집 마감일
  person: { type: Number, required: true, min: 1 }, // 모집 인원
  preferences: { type: String, required: true, default: "무관" }, // 우대 사항
  education: { type: EducationSchema, required: true }, // 학력
  address: { type: AddressSchema, required: true }, // 근무지 주소
  recruiter: { type: RecruiterSchema, required: true }, // 채용 담당자
  createdAt: { type: Date, default: Date.now }, // 생성 날짜
});

// 모델 생성
const JobPosting = mongoose.model("JobPosting", JobPostingSchema);

/**
 * @swagger
 * /api/post/notice:
 *   post:
 *     summary: post 스키마 생성 API
 *     description: 사용자가 공고 등록 시 사용됨
 *     responses:
 *       200:
 *         description: 성공적으로 post 스키마 생성
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "post success"
 */
router.post("/notice", async (req, res) => {
  try {
    const newPost = new JobPosting({ ...req.body });
    await newPost.save(); // 새로 생성한 객체를 DB에 저장

    res.status(200).end();
    // .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/post/update/{postId}:
 *   post:
 *     summary: post 스키마 수정 API
 *     description: 사용자가 공고 수정 시 사용됨
 *     responses:
 *       200:
 *         description: 성공적으로 post 스키마 수정
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "post update success"
 */
router.post("/update/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    // 요청 데이터에서 `undefined`가 아닌 값만 `updateFields`에 추가
    const updateFields = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // MongoDB에서 해당 postId의 데이터를 찾아 업데이트
    const updatedPost = await JobPosting.findByIdAndUpdate(
      postId,
      updateFields,
      {
        new: true, // 업데이트된 문서를 반환
        runValidators: true, // 유효성 검사 실행
      }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (err) {
    console.error("에러 발생:", err);
    res.status(500).json({ error: err.message });
  }
});
// fetch / 뭐시였더라?("/update/:postId" 로 바꾸기

/**
 * @swagger
 * /api/post/delete/{postId}:
 *   delete:
 *     summary: post 스키마 삭제 API
 *     description: 사용자가 공고 삭제 시 사용됨
 *     responses:
 *       200:
 *         description: 성공적으로 post 스키마 삭제
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "post delete success"
 */
// router.delete("/delete/:postId", async (req, res) => {
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    // MongoDB에서 해당 postId의 데이터를 찾아 업데이트
    const deletePost = await JobPosting.findByIdAndDelete(postId);

    if (!deletePost) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    res
      .status(200)
      .json({ message: "Post deleted successfully", post: deletePost });
  } catch (err) {
    console.error("에러 발생:", err);
    res.status(500).json({ error: err.message });
  }
});
// delete("/:postId" 로 바꾸기

/**
 * @swagger
 * /api/post/get/notice/lists:
 *   get:
 *     summary: notice 목록 전체 가져오기 API
 *     description: 공고 목록 보기 시 사용 됨 (필요한 데이터만 불러오는거로 했음)
 *     responses:
 *       200:
 *         description: 성공적으로 get 완료
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "get all notice lists"
 */
// router.get("/get/notice/lists", async (req, res) => {
router.get("/lists", async (req, res) => {
  try {
    // 모든 공고 데이터 가져옴
    const posts = await JobPosting.find().select(
      "_id title companyInfo.exposedArea.goo payType pay workingPeriod endOfNotice companyInfo.companyName "
    );

    if (!posts.length) {
      return res.status(404).json({ message: "공고가 없습니다." });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("에러 발생:", err);
    res.status(500).json({ error: err.message });
  }
});
// get("/lists" 로 바꾸기

/**
 * @swagger
 * /api/post/get/notice/{postId}:
 *   get:
 *     summary: notice 하나의 정보 가져오기 API
 *     description: 공고 상세 보기 시 사용 됨
 *     responses:
 *       200:
 *         description: 성공적으로 get 완료
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "get notice success"
 */
// router.get("/get/oneNotice/:postId", async (req, res) => {
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await JobPosting.findById(postId);

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "해당 공고를 찾을 수 없습니다." });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("에러 발생: ", err);
    res.status(500).json({ err: err.message });
  }
});
// get("/:postId" 로 바꾸기

export default router;
