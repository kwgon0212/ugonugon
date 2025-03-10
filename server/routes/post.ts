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
const JobPostingSchema = new Schema({
  title: { type: String, required: true, default: "" },
  jobType: { type: String, required: true, default: "전체" },
  pay: {
    type: { type: String, required: true, default: "시급" },
    value: { type: Number, required: true, default: 0 },
  },
  hireType: { type: [String], required: true, default: ["일일"] },
  period: {
    start: { type: Date, required: true, default: Date.now },
    end: { type: Date, required: true, default: Date.now },
    discussion: { type: Boolean, default: false }, // 선택 가능
  },
  hour: {
    start: { type: Date, required: true, default: Date.now },
    end: { type: Date, required: true, default: Date.now },
    discussion: { type: Boolean, default: false }, // 선택 가능
  },
  restTime: {
    start: { type: Date, required: true, default: Date.now },
    end: { type: Date, required: true, default: Date.now },
  },
  day: { type: [String], required: true, default: ["월"] },
  workDetail: { type: String, default: "" },
  welfare: { type: String, default: "" },
  postDetail: { type: String, default: "" },
  deadline: {
    date: { type: Date, required: true, default: Date.now },
    time: { type: Date, required: true, default: Date.now },
  },
  person: { type: Number, required: true, min: 1 },
  preferences: { type: String, default: "" },
  education: {
    school: { type: String, required: true, default: "무관" },
    state: { type: String, required: true, default: "무관" },
  },
  address: {
    zipcode: { type: String, required: true },
    street: { type: String, required: true },
    detail: { type: String },
    lat: Number,
    lng: Number,
  },
  recruiter: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  applies: [
    {
      _id: false,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
        required: true,
      },
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
      status: { type: String, enum: ["pending", "accepted", "rejected"] },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});

// 모델 생성
const JobPosting = mongoose.model("JobPosting", JobPostingSchema, "posts");

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
    const { author, ...postData } = req.body;
    const newPost = new JobPosting({
      ...postData,
      author: new mongoose.Types.ObjectId(author),
    });

    await newPost.save(); // 새로 생성한 객체를 DB에 저장

    res.status(200).json({ postId: newPost._id });
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
router.put("/:postId", async (req, res) => {
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

router.post("/:postId/apply", async (req, res) => {
  try {
    const { postId } = req.params;
    const { resumeId, userId } = req.body;

    // 유효한 ObjectId인지 확인
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "유효하지 않은 공고 ID입니다." });
    }

    if (!userId || !resumeId) {
      return res
        .status(400)
        .json({ message: "userId 및 resumeId가 필요합니다." });
    }

    // 문자열을 ObjectId로 변환
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const resumeObjectId = new mongoose.Types.ObjectId(resumeId);
    const postObjectId = new mongoose.Types.ObjectId(postId);

    // 해당 공고 찾기
    const post = await JobPosting.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "해당 공고를 찾을 수 없습니다." });
    }

    // applies 필드가 없으면 추가
    if (!post.applies || !Array.isArray(post.applies)) {
      post.set("applies", []);
    }

    // 중복 지원 방지 (이미 지원한 경우)
    const isAlreadyApplied = post.applies.some(
      (apply) => apply.userId.toString() === userId
    );

    if (isAlreadyApplied) {
      return res.status(400).json({ message: "이미 지원한 공고입니다." });
    }

    // 지원 정보 추가 (ObjectId 변환 후 저장)
    post.applies.push({
      userId: userObjectId,
      resumeId: resumeObjectId,
      postId: postObjectId,
      status: "pending",
      appliedAt: new Date(),
    });

    // DB 업데이트
    await post.save();

    res.status(200).json({ message: "공고 지원 완료", applies: post.applies });
  } catch (err) {
    console.error("공고 지원 중 오류 발생:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/:postId/apply/status", async (req, res) => {
  const { postId } = req.params;
  const { userId, status } = req.body;

  try {
    const post = await JobPosting.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "공고를 찾을 수 없습니다." });
    }

    // 특정 지원 내역 찾기
    const apply = post.applies.find((app) => app.userId.toString() === userId);
    if (!apply) {
      return res.status(404).json({ error: "지원 내역을 찾을 수 없습니다." });
    }

    // 지원 상태 업데이트
    apply.status = status;
    await post.save(); // 변경 사항 저장

    res
      .status(200)
      .json({ message: `지원 상태가 ${status}로 변경되었습니다.` });
  } catch (error) {
    console.error("지원 상태 업데이트 실패:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
