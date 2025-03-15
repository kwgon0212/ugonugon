import { error, log } from "console";
import express from "express";
import mongoose from "mongoose";
import { Users } from "./users";
import multer from "multer";
import { bucket } from "../firebaseAdmin";

const router = express.Router();
const { Schema } = mongoose;
const upload = multer({ storage: multer.memoryStorage() });

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
  images: [String],
});

// 모델 생성
const JobPosting = mongoose.model("JobPosting", JobPostingSchema, "posts");

const User = mongoose.models.users;

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
// router.post("/notice", async (req, res) => {
//   try {
//     const { author, ...postData } = req.body;
//     const newPost = new JobPosting({
//       ...postData,
//       author: new mongoose.Types.ObjectId(author),
//     });

//     await newPost.save(); // 새로 생성한 객체를 DB에 저장

//     res.status(200).json({ postId: newPost._id });
//     // .json({ message: "Post created successfully", post: newPost });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/notice", upload.array("images", 5), async (req, res) => {
  try {
    const { author, ...postData } = req.body;

    const parseJSON = (data: any) => {
      return data ? JSON.parse(data) : null;
    };

    const parsedPostData = {
      ...postData,
      pay: parseJSON(postData.pay),
      hireType: parseJSON(postData.hireType),
      period: parseJSON(postData.period),
      hour: parseJSON(postData.hour),
      restTime: parseJSON(postData.restTime),
      day: parseJSON(postData.day),
      welfare: parseJSON(postData.welfare),
      deadline: parseJSON(postData.deadline),
      preferences: parseJSON(postData.preferences),
      education: parseJSON(postData.education),
      address: parseJSON(postData.address),
      recruiter: parseJSON(postData.recruiter),
    };

    if (!author) {
      return res.status(400).json({ message: "작성자가 필요합니다." });
    }

    const newPost = new JobPosting({
      ...parsedPostData,
      author: new mongoose.Types.ObjectId(author),
      images: [],
    });

    await newPost.save();
    const postId = newPost._id.toString();

    const uploadedImages: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const fileName = `posts/${postId}/${Date.now()}_${file.originalname}`;
        const storageFile = bucket.file(fileName);
        const stream = storageFile.createWriteStream({
          metadata: { contentType: file.mimetype },
        });

        await new Promise((resolve, reject) => {
          stream.on("error", reject);
          stream.on("finish", async () => {
            await storageFile.makePublic();
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            uploadedImages.push(imageUrl);
            resolve(true);
          });
          stream.end(file.buffer);
        });
      }
    }

    newPost.images = uploadedImages;
    await newPost.save();

    res.status(200).json({ postId: newPost._id, images: uploadedImages });
  } catch (err) {
    console.error("공고 등록 오류:", err);
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
// router.put("/:postId", async (req, res) => {
//   try {
//     const { postId } = req.params;
//     if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ message: "Invalid Post ID" });
//     }

//     // 요청 데이터에서 `undefined`가 아닌 값만 `updateFields`에 추가
//     const updateFields = Object.fromEntries(
//       Object.entries(req.body).filter(([_, value]) => value !== undefined)
//     );

//     if (Object.keys(updateFields).length === 0) {
//       return res.status(400).json({ message: "No valid fields to update" });
//     }

//     // MongoDB에서 해당 postId의 데이터를 찾아 업데이트
//     const updatedPost = await JobPosting.findByIdAndUpdate(
//       postId,
//       updateFields,
//       {
//         new: true, // 업데이트된 문서를 반환
//         runValidators: true, // 유효성 검사 실행
//       }
//     );

//     if (!updatedPost) {
//       return res.status(404).json({ message: "Post Not Found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Post updated successfully", post: updatedPost });
//   } catch (err) {
//     console.error("에러 발생:", err);
//     res.status(500).json({ error: err.message });
//   }
// });
// fetch / 뭐시였더라?("/update/:postId" 로 바꾸기

router.put("/:postId", upload.array("newImages", 5), async (req, res) => {
  try {
    const { postId } = req.params;
    const { deletedImages, ...updatedData } = req.body;

    const post = await JobPosting.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "해당 공고를 찾을 수 없습니다." });
    }

    let updatedImages = post.images;

    // 🔥 1️⃣ 삭제할 이미지 처리 (Firebase에서도 삭제)
    if (deletedImages) {
      const imagesToDelete = JSON.parse(deletedImages); // 클라이언트에서 배열 형태로 전송
      updatedImages = updatedImages.filter(
        (img) => !imagesToDelete.includes(img)
      );

      for (const img of imagesToDelete) {
        const filePath = img.split(
          `https://storage.googleapis.com/${bucket.name}/`
        )[1];
        await bucket.file(filePath).delete(); // Firebase Storage에서 삭제
      }
    }

    // 🔥 2️⃣ 새로운 이미지 업로드 처리
    const uploadedImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const fileName = `posts/${postId}/${Date.now()}_${file.originalname}`;
        const storageFile = bucket.file(fileName);
        const stream = storageFile.createWriteStream({
          metadata: { contentType: file.mimetype },
        });

        await new Promise((resolve, reject) => {
          stream.on("error", reject);
          stream.on("finish", async () => {
            await storageFile.makePublic();
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            uploadedImages.push(imageUrl);
            resolve(true);
          });
          stream.end(file.buffer);
        });
      }
    }

    const parseJSON = (data: any) => {
      return data ? JSON.parse(data) : null;
    };

    const parsedPostData = {
      ...updatedData,
      pay: parseJSON(updatedData.pay),
      hireType: parseJSON(updatedData.hireType),
      period: parseJSON(updatedData.period),
      hour: parseJSON(updatedData.hour),
      restTime: parseJSON(updatedData.restTime),
      day: parseJSON(updatedData.day),
      welfare: parseJSON(updatedData.welfare),
      deadline: parseJSON(updatedData.deadline),
      preferences: parseJSON(updatedData.preferences),
      education: parseJSON(updatedData.education),
      address: parseJSON(updatedData.address),
      recruiter: parseJSON(updatedData.recruiter),
    };

    // 🔥 3️⃣ DB 업데이트 (삭제된 이미지 제거 + 새 이미지 추가)
    post.set({
      ...parsedPostData,
      images: [...updatedImages, ...uploadedImages],
    });

    await post.save();

    res.status(200).json({
      message: "공고가 수정되었습니다.",
      post,
      images: post.images,
    });
  } catch (err) {
    console.error("공고 수정 오류:", err);
    res.status(500).json({ error: err.message });
  }
});

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
// router.delete("/:postId", async (req, res) => {
//   try {
//     const { postId } = req.params;
//     if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ message: "Invalid Post ID" });
//     }

//     // MongoDB에서 해당 postId의 데이터를 찾아 업데이트
//     const deletePost = await JobPosting.findByIdAndDelete(postId);

//     if (!deletePost) {
//       return res.status(404).json({ message: "Post Not Found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Post deleted successfully", post: deletePost });
//   } catch (err) {
//     console.error("에러 발생:", err);
//     res.status(500).json({ error: err.message });
//   }
// });
// delete("/:postId" 로 바꾸기

router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "잘못된 ID 형식입니다." });
    }

    const post = await JobPosting.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "해당 공고를 찾을 수 없습니다." });
    }

    // 🔥 Firebase Storage 이미지 삭제
    if (post.images && post.images.length > 0) {
      const deletePromises = post.images.map(async (imageUrl: string) => {
        try {
          const filePath = imageUrl.split(
            `https://storage.googleapis.com/${bucket.name}/`
          )[1];
          if (filePath) {
            await bucket.file(filePath).delete();
            console.log(`✅ 삭제 완료: ${filePath}`);
          }
        } catch (error) {
          console.error(`❌ Firebase 이미지 삭제 실패: ${imageUrl}`, error);
        }
      });

      await Promise.all(deletePromises); // 모든 이미지 삭제
    }

    // 🔥 MongoDB에서 공고 삭제
    await JobPosting.findByIdAndDelete(postId);
    res.status(200).json({ message: "공고가 삭제되었습니다." });
  } catch (err) {
    console.error("공고 삭제 오류:", err);
    res.status(500).json({ error: err.message });
  }
});

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
    const posts = await JobPosting.find();

    if (!posts.length) {
      return res.status(404).json({ message: "공고가 없습니다." });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("에러 발생:", err);
    res.status(500).json({ error: err.message });
  }
});

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
router.get("/", async (req, res) => {
  const { postId, latest, urgent, street } = req.query;

  try {
    if (postId) {
      const post = await JobPosting.findById(postId);
      if (!post) {
        return res
          .status(404)
          .json({ message: "해당 공고를 찾을 수 없습니다." });
      }
      return res.status(200).json(post);
    }

    let query: any = {};

    if (urgent) {
      query.hireType = { $in: ["긴급"] };
    }

    if (street) {
      query["address.street"] = { $regex: `^${street}`, $options: "i" };
    }

    let posts = await JobPosting.find(query)
      .sort({ createdAt: -1 })
      .limit(latest ? 10 : 100);

    res.status(200).json(posts);
  } catch (err) {
    console.error("에러 발생: ", err);
    res.status(500).json({ err: err.message });
  }
});

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

    const user = await User.findById(userId);

    if (!user.applies || !Array.isArray(user.applies)) {
      user.set("applies", []);
    }

    user.applies.push({
      postId: new mongoose.Types.ObjectId(postId),
      status: "pending",
      appliedAt: new Date(),
    });

    await user.save();

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

    const result = await Users.findOneAndUpdate(
      { _id: userId, "applies.postId": postId }, // 특정 postId를 가진 applies 배열 찾기
      { $set: { "applies.$.status": status } }, // 배열 안의 해당 요소의 status 변경
      { new: true } // 업데이트 후 변경된 문서 반환
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "해당 유저의 지원 내역을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ message: `지원 상태가 ${status}로 변경되었습니다.` });
  } catch (error) {
    console.error("지원 상태 업데이트 실패:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

//API: GET/api/recruit/manage
//사용자가 등록한 공고 목록 조회 API
router.get("/recruit/manage/:authorId", async (req, res) => {
  try {
    const { authorId } = req.params;

    const authorObjectId = new mongoose.Types.ObjectId(authorId);

    //author가 현재 로그인한 사용자와 일치하는 공고 검색
    const myPosts = await JobPosting.find({ author: authorObjectId }).sort({
      createdAt: -1,
    });

    if (!myPosts.length) {
      return res
        .status(200)
        .json({ message: "등록한 공고가 없습니다.", posts: [] });
    }
    res
      .status(200)
      .json({ message: "성공적으로 공고를 불러왔습니다.", posts: myPosts });
  } catch (err) {
    console.error("사용자 공고 조회 중 오류 발생:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    // 페이지네이션 파라미터
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const query: any = {};

    // 검색어 필터링 (제목)
    if (req.query.search && typeof req.query.search === "string") {
      query.title = { $regex: req.query.search, $options: "i" }; // 대소문자 구분 없이 검색
    }

    // 직종 필터링
    if (
      req.query.jobType &&
      typeof req.query.jobType === "string" &&
      req.query.jobType !== "직종 전체" &&
      req.query.jobType !== "전체"
    ) {
      query.jobType = req.query.jobType;
    }

    // 지역 필터링
    if (
      req.query.sido &&
      typeof req.query.sido === "string" &&
      req.query.sido !== "전체"
    ) {
      const addressRegex: string[] = [];
      addressRegex.push(req.query.sido);

      if (
        req.query.sigungu &&
        typeof req.query.sigungu === "string" &&
        req.query.sigungu !== "전체"
      ) {
        addressRegex.push(req.query.sigungu);
      }

      // 주소 필드의 street에 시도/시군구가 포함되어 있는지 검색
      query["address.street"] = {
        $regex: addressRegex.join(".*"),
        $options: "i",
      };
    }

    // 급여 필터링
    if (
      req.query.payType &&
      typeof req.query.payType === "string" &&
      req.query.payValue &&
      typeof req.query.payValue === "string" &&
      parseInt(req.query.payValue) > 0
    ) {
      query["pay.type"] = req.query.payType;
      query["pay.value"] = { $gte: parseInt(req.query.payValue) };
    }

    // 고용 형태 필터링
    if (req.query.hireType && typeof req.query.hireType === "string") {
      // 쉼표로 구분된 문자열을 배열로 분할
      const hireTypes = req.query.hireType.split(",");
      if (hireTypes.length > 0) {
        query.hireType = { $in: hireTypes };
      }
    }

    // 근무 기간 필터링
    if (req.query.startDate || req.query.endDate) {
      const periodQuery: any = {};

      if (req.query.startDate && typeof req.query.startDate === "string") {
        // 협의 가능하거나, 종료일이 startDate 이후인 공고
        periodQuery.$or = [
          { "period.discussion": true },
          { "period.end": { $gte: new Date(req.query.startDate) } },
        ];
      }

      if (req.query.endDate && typeof req.query.endDate === "string") {
        // 협의 가능하거나, 시작일이 endDate 이전인 공고
        periodQuery.$or = periodQuery.$or || [];
        periodQuery.$or.push(
          { "period.discussion": true },
          { "period.start": { $lte: new Date(req.query.endDate) } }
        );
      }

      // 기존 쿼리에 병합
      if (Object.keys(periodQuery).length > 0) {
        query.$and = query.$and || [];
        query.$and.push(periodQuery);
      }
    }

    // 총 결과 수 계산
    const total = await JobPosting.countDocuments(query);

    // 필터링된 결과 조회 (필요한 필드만 가져옴)
    const posts = await JobPosting.find(query, {
      title: 1,
      jobType: 1,
      pay: 1,
      hireType: 1,
      period: 1,
      deadline: 1,
      address: 1,
      images: { $slice: 1 }, // 대표 이미지 하나만 가져옴
      createdAt: 1,
    })
      .sort({ createdAt: -1 }) // 최신순으로 정렬
      .skip(skip)
      .limit(limit);

    // 응답 데이터
    res.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("공고 검색 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id: postId } = req.params;
    console.log(postId);

    // ID 형식 검증
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "유효하지 않은 공고 ID입니다." });
    }

    const post = await JobPosting.findById(postId)
      .populate("author", "name") // 작성자 정보 가져오기
      .populate("applies.userId", "name") // 지원자 정보 가져오기
      .exec();

    if (!post) {
      return res.status(404).json({ error: "공고를 찾을 수 없습니다." });
    }

    res.json(post);
  } catch (error) {
    console.error("공고 상세 조회 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
