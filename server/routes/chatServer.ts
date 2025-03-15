import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { io } from "../server.ts";
import { Users } from "./users.ts";

const router = Router();

// 메시지 스키마
const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  text: { type: String, required: true },
  senderId: { type: String, required: true }, // 발신자 ID 또는 'system'
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  localId: { type: String }, // 클라이언트에서 생성한 메시지 ID
  isSystemMessage: { type: Boolean, default: false }, // 시스템 메시지 여부
});

const Message = mongoose.model("Message", messageSchema);

// 유저 스키마
// const userSchema = new mongoose.Schema({
//   _id: { type: String, required: true }, // 사용자 ID
//   name: { type: String, required: true }, // 사용자 이름
//   // 추가 필드는 필요에 따라 추가
// });

// const Useree = mongoose.model("Useree", userSchema);
// const Users = mongoose.models.users;

// 공고 스키마 (JobPosting 모델 정의)
const JobPostingSchema = new mongoose.Schema(
  {
    title: String,
    recruiter: {
      name: String,
      email: String,
      phone: String,
    },
    author: mongoose.Schema.Types.ObjectId,
  },
  { strict: false }
);

// JobPosting 모델을 posts 컬렉션에 연결
const JobPosting = mongoose.model("JobPostingTemp", JobPostingSchema, "posts");

// 채팅방 스키마
const chatRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  participants: [{ type: String, required: true }], // 참여자 ID 배열
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

// 소켓 클라이언트 ID와 사용자 ID, 방 ID 매핑을 위한 객체
const userSockets = new Map();

// 소켓 이벤트 핸들러 설정
const setupSocketHandlers = () => {
  io.on("connection", (socket) => {
    console.log("새로운 소켓 연결:", socket.id);

    // 사용자 연결 시 사용자 ID와 소켓 ID 매핑
    socket.on("join_user", ({ userId }) => {
      console.log(`사용자 ${userId}가 소켓 ${socket.id}로 연결됨`);
      userSockets.set(userId, socket.id);

      // 사용자가 참여하고 있는 모든 채팅방 조회해서 자동 join
      ChatRoom.find({ participants: userId })
        .then((rooms) => {
          rooms.forEach((room) => {
            socket.join(room.roomId);
            console.log(
              `사용자 ${userId}가 채팅방 ${room.roomId}에 자동 참여함`
            );
          });
        })
        .catch((err) => console.error("채팅방 조회 오류:", err));
    });

    // 특정 채팅방에 입장
    socket.on("join_room", ({ roomId }) => {
      socket.join(roomId);
      console.log(`소켓 ${socket.id}가 채팅방 ${roomId}에 참여함`);
    });

    // 특정 채팅방 퇴장
    socket.on("leave_room", ({ roomId }) => {
      socket.leave(roomId);
      console.log(`소켓 ${socket.id}가 채팅방 ${roomId}에서 퇴장함`);
    });

    // 채팅 메시지 처리 - 시스템 메시지 처리 개선
    socket.on("chat message", (msg) => {
      console.log("메시지 수신:", msg);

      // 시스템 메시지인 경우 별도 처리
      if (msg.isSystemMessage || msg.senderId === "system") {
        console.log("시스템 메시지 처리:", msg.text);

        // 시스템 메시지 저장
        const systemMessage = new Message({
          roomId: msg.roomId,
          text: msg.text,
          senderId: "system",
          time: msg.time,
          isRead: true, // 시스템 메시지는 기본적으로 읽음 상태
          isSystemMessage: true,
          localId: msg.localId || `system_${Date.now()}`, // 로컬 ID가 없으면 생성
        });

        systemMessage
          .save()
          .then(async (savedMessage) => {
            console.log("시스템 메시지 저장 성공:", savedMessage);

            // 해당 채팅방에 시스템 메시지 전송 (중요: 저장 후 즉시 전송)
            io.to(msg.roomId).emit("chat message", {
              ...msg,
              _id: savedMessage._id.toString(),
              createdAt: savedMessage.createdAt,
            });

            // 채팅방 마지막 활동 시간 업데이트
            await ChatRoom.findOneAndUpdate(
              { roomId: msg.roomId },
              { lastActivity: new Date() }
            );
          })
          .catch((err) => {
            console.error("시스템 메시지 저장 오류:", err);
          });
        return;
      }

      // 일반 메시지 처리
      const newMessage = new Message({
        roomId: msg.roomId,
        text: msg.text,
        senderId: msg.senderId,
        time: msg.time,
        isRead: false,
        localId: msg.localId,
      });

      newMessage
        .save()
        .then(async (savedMessage) => {
          console.log("메시지 저장 성공:", savedMessage);

          // 클라이언트에게 전달할 메시지 객체에 서버 ID와 로컬 ID 모두 포함
          const messageToSend = {
            ...msg,
            _id: savedMessage._id.toString(),
            createdAt: savedMessage.createdAt,
          };

          // 해당 채팅방에 있는 모든 소켓에게 메시지 전송
          io.to(msg.roomId).emit("chat message", messageToSend);

          // 채팅방 마지막 활동 시간 업데이트
          await ChatRoom.findOneAndUpdate(
            { roomId: msg.roomId },
            { lastActivity: new Date() }
          );
        })
        .catch((err) => {
          console.error("메시지 저장 오류:", err);
        });
    });

    // 연결 해제 시 처리
    socket.on("disconnect", () => {
      console.log("소켓 연결 해제:", socket.id);

      // userId-socket 매핑에서 제거
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`사용자 ${userId}의 연결이 해제됨`);
          break;
        }
      }
    });
  });
};

// 서버 초기화 함수 - 정적 데이터 생성 제거
export const initializeChatServer = async () => {
  setupSocketHandlers();
  console.log("채팅 서버 초기화 완료");
};

// ---- API 라우트 정의 ----

// 사용자 정보 조회 API - 수정
router.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // API 호출 전 유효성 검사
    if (!userId || userId === "undefined" || userId === "null") {
      console.warn("유효하지 않은 사용자 ID:", userId);
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // 디버깅을 위한 로그
    console.log(`사용자 정보 조회 시도: ${userId}`);

    // 1. Users 컬렉션에서 ObjectId로 조회
    try {
      const UserSchema = new mongoose.Schema(
        {
          name: String,
          email: String,
          phone: String,
          profile: String,
          businessNumber: Array,
          sex: String,
          residentId: String,
          address: Object,
          signature: String,
          bankAccount: Object,
          password: String,
        },
        { strict: false }
      );

      // 모델이 이미 존재하는지 확인하고, 그렇지 않으면 새로 생성
      const Users =
        mongoose.models.RealUserModel ||
        mongoose.model("RealUserModel", UserSchema, "users");

      // ObjectId로 변환 시도
      let objId;
      try {
        objId = new mongoose.Types.ObjectId(userId);
        console.log("ObjectId 변환 성공:", objId);
      } catch (e) {
        console.log(`사용자 ID ${userId}는 ObjectId로 변환할 수 없음`);
      }

      // ObjectId로 검색 시도
      if (objId) {
        const user = await Users.findById(objId);
        if (user) {
          console.log(`ObjectId로 사용자 찾음: ${user.name}`);
          return res.status(200).json({
            _id: userId,
            name: user.name || "사용자",
            email: user.email || "",
            phone: user.phone || "",
            profile: user.profile || "",
          });
        }
      }

      // 2. phone, email로 검색 시도
      const userByField = await Users.findOne({
        $or: [{ phone: userId }, { email: userId }],
      });

      if (userByField) {
        console.log(`필드 검색으로 사용자 찾음: ${userByField.name}`);
        return res.status(200).json({
          _id: userId,
          name: userByField.name || "사용자",
          email: userByField.email || "",
          phone: userByField.phone || "",
          profile: userByField.profile || "",
        });
      }
    } catch (userError) {
      console.error("users 컬렉션 조회 중 오류:", userError);
    }

    // 3. Users 모델에서 사용자 조회 (백업)
    const user = await Users.findById(userId);
    if (user) {
      console.log(`Users 모델에서 사용자 찾음: ${user.name}`);
      return res.status(200).json(user);
    }

    // 4. 공고 작성자 정보 조회
    try {
      const PostSchema = new mongoose.Schema(
        {
          author: mongoose.Schema.Types.ObjectId,
          recruiter: {
            name: String,
            email: String,
            phone: String,
          },
        },
        { strict: false }
      );

      const Post =
        mongoose.models.PostModel ||
        mongoose.model("PostModel", PostSchema, "posts");

      // ObjectId로 변환
      let objId;
      try {
        objId = new mongoose.Types.ObjectId(userId);
      } catch (e) {
        console.log(`ID ${userId}는 ObjectId로 변환할 수 없음`);
      }

      if (objId) {
        const post = await Post.findOne({ author: objId });
        if (post && post.recruiter && post.recruiter.name) {
          console.log(`공고 작성자 정보 찾음: ${post.recruiter.name}`);
          return res.status(200).json({
            _id: userId,
            name: post.recruiter.name || "사용자",
            email: post.recruiter.email || "",
            phone: post.recruiter.phone || "",
          });
        }
      }
    } catch (postError) {
      console.error("공고 작성자 정보 조회 오류:", postError);
    }

    // 5. 모든 조회 방법 실패 - 기본값 반환
    console.log(`사용자 ID ${userId}에 대한 정보를 찾을 수 없음, 기본값 사용`);
    return res.status(200).json({
      _id: userId,
      name: "사용자",
    });
  } catch (error) {
    console.error("사용자 정보 조회 중 오류 발생:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// 사용자 목록 조회 API
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await Users.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// 작성자 ID로 공고 정보 조회 API
router.get("/post/author/:authorId", async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;

    if (!authorId || authorId === "undefined" || authorId === "null") {
      return res.status(400).json({ message: "Invalid author ID" });
    }

    // ObjectId로 변환
    const objId = new mongoose.Types.ObjectId(authorId);

    // JobPosting 모델로 작성자 정보 조회
    const post = await JobPosting.findOne({ author: objId });

    if (!post) {
      return res
        .status(404)
        .json({ message: "No posts found for this author" });
    }

    // 작성자 정보 반환
    res.status(200).json({
      recruiter: post.recruiter || { name: "사용자" },
      author: post.author,
    });
  } catch (error) {
    console.error("Error fetching author info:", error);
    res.status(500).json({ message: "Failed to fetch author info" });
  }
});

// 작성자 ID로 직접 공고 검색 API
router.get("/post/by-author/:authorId", async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;

    if (!authorId || authorId === "undefined" || authorId === "null") {
      return res.status(400).json({ message: "Invalid author ID" });
    }

    // ObjectId로 변환
    const objId = new mongoose.Types.ObjectId(authorId);

    // JobPosting 모델로 공고 정보 조회
    const post = await JobPosting.findOne({ author: objId });

    if (!post) {
      return res
        .status(404)
        .json({ message: "No posts found for this author" });
    }

    // 공고 정보 반환
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post by author:", error);
    res.status(500).json({ message: "Failed to fetch post by author" });
  }
});

// 모든 채팅방의 마지막 메시지를 가져오는 API
router.get("/messages/latest", async (req: Request, res: Response) => {
  try {
    // 각 채팅방별로 가장 최근 메시지를 가져오는 MongoDB 집계 쿼리
    const latestMessages = await Message.aggregate([
      {
        $sort: { createdAt: -1 }, // 최신 메시지부터 정렬
      },
      {
        $group: {
          _id: "$roomId", // roomId로 그룹화
          message: { $first: "$$ROOT" }, // 각 그룹에서 첫 번째(최신) 메시지 전체를 가져옴
        },
      },
    ]);

    // 결과 변환
    const result = latestMessages.map((item) => ({
      roomId: item._id,
      text: item.message.text,
      time: item.message.time,
      createdAt: item.message.createdAt,
      senderId: item.message.senderId, // 발신자 정보 추가
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("마지막 메시지 조회 오류:", error);
    res.status(500).json({ message: "마지막 메시지 조회에 실패했습니다" });
  }
});

// 특정 채팅방의 메시지 조회 라우트
router.get("/messages/:roomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    // 특정 채팅방의 메시지를 시간 순으로 조회
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Failed to retrieve messages" });
  }
});

// 안 읽은 메시지 개수를 가져오는 API
router.get(
  "/messages/unread/:roomId/:userId",
  async (req: Request, res: Response) => {
    try {
      const { roomId, userId } = req.params;

      // 해당 채팅방에서 사용자가 아직 읽지 않은 메시지 개수 조회
      const unreadCount = await Message.countDocuments({
        roomId,
        senderId: { $ne: userId }, // 사용자가 보낸 메시지는 제외
        isRead: false,
      });

      res.status(200).json({ unreadCount });
    } catch (error) {
      console.error("안 읽은 메시지 개수 조회 오류:", error);
      res
        .status(500)
        .json({ message: "안 읽은 메시지 개수 조회에 실패했습니다" });
    }
  }
);

// 메시지를 읽음 상태로 변경하는 API
router.put(
  "/messages/read/:roomId/:userId",
  async (req: Request, res: Response) => {
    try {
      const { roomId, userId } = req.params;

      // 해당 채팅방에서 다른 사용자가 보낸 모든 메시지를 읽음 상태로 업데이트
      await Message.updateMany(
        {
          roomId,
          senderId: { $ne: userId }, // 현재 사용자가 보낸 메시지는 제외
          isRead: false,
        },
        { isRead: true }
      );

      res
        .status(200)
        .json({ message: "메시지를 읽음 상태로 업데이트했습니다" });
    } catch (error) {
      console.error("메시지 읽음 상태 업데이트 오류:", error);
      res
        .status(500)
        .json({ message: "메시지 읽음 상태 업데이트에 실패했습니다" });
    }
  }
);

// 방 나가기 시 특정 방의 메시지만 삭제하는 라우트
router.delete("/messages/clear", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    // 특정 채팅방의 모든 메시지 삭제
    await Message.deleteMany({ roomId });

    res.status(200).json({ message: "Messages cleared successfully" });
  } catch (error) {
    console.error("Error clearing messages:", error);
    res.status(500).json({ message: "Failed to clear messages" });
  }
});

// 채팅방 생성 API
router.post("/chat-rooms", async (req: Request, res: Response) => {
  try {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
      return res.status(400).json({ message: "Both user IDs are required" });
    }

    // 채팅방 ID 생성 (항상 작은 ID가 앞에 오도록)
    const [smallerId, largerId] = [user1Id, user2Id].sort();
    const roomId = `chat_${smallerId}_${largerId}`;

    // 이미 존재하는 채팅방인지 확인
    const existingRoom = await ChatRoom.findOne({ roomId });

    if (existingRoom) {
      return res.status(200).json(existingRoom);
    }

    // 새 채팅방 생성
    const newRoom = new ChatRoom({
      roomId,
      participants: [user1Id, user2Id],
    });

    await newRoom.save();

    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ message: "Failed to create chat room" });
  }
});

// 사용자의 채팅방 목록 조회 라우트
router.get("/chat-rooms/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // 해당 사용자가 포함된 모든 채팅방 찾기
    const rooms = await ChatRoom.find({ participants: userId });

    // 결과 변환 (채팅방 ID만 반환)
    const result = rooms.map((room) => room.roomId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ message: "Failed to fetch chat rooms" });
  }
});

// 채팅방 삭제 API
router.delete("/chat-rooms/:roomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    // 채팅방 찾기
    const room = await ChatRoom.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    // 채팅방 삭제
    await ChatRoom.deleteOne({ roomId });
    console.log(`채팅방 삭제 완료: ${roomId}`);

    res.status(200).json({ message: "Chat room deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat room:", error);
    res.status(500).json({ message: "Failed to delete chat room" });
  }
});
// chatServer.ts 파일에 다음 함수와 API 엔드포인트를 추가합니다

// 메시지 시간 포맷팅 함수 (서버 측에서 사용)
const formatServerMessageTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// 시스템 메시지 저장 API
router.post("/system-message", async (req: Request, res: Response) => {
  try {
    const { roomId, text, time } = req.body;

    if (!roomId || !text) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // 시스템 메시지 생성
    const systemMessage = new Message({
      roomId,
      text,
      senderId: "system",
      time: time || formatServerMessageTime(), // 서버 측 함수 사용
      isRead: true,
      isSystemMessage: true,
      localId: `system_${Date.now()}`,
    });

    // 메시지 저장
    const savedMessage = await systemMessage.save();
    console.log("시스템 메시지 직접 저장 성공:", savedMessage);

    // 채팅방 마지막 활동 시간 업데이트
    await ChatRoom.findOneAndUpdate({ roomId }, { lastActivity: new Date() });

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("시스템 메시지 저장 중 오류:", error);
    res.status(500).json({ message: "Failed to save system message" });
  }
});

export default router;
