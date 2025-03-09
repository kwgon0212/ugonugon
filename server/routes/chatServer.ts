// routes/chatServer.ts

import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { io } from "../server.ts";

const router = Router();

// 메시지 스키마
const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  text: { type: String, required: true },
  senderId: { type: String, required: true }, // 발신자 ID
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }, // 읽음 상태 추가
});

const Message = mongoose.model("Message", messageSchema);

// 유저 스키마
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // 사용자 ID
  name: { type: String, required: true }, // 사용자 이름
  // 추가 필드는 필요에 따라 추가
});

const Useree = mongoose.model("Useree", userSchema);

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

// 초기 사용자 데이터 저장 함수
export const ensureUsersExist = async () => {
  try {
    const users = [
      { _id: "67c7d6bf38fe53ff868e3880", name: "홍길동" },
      { _id: "67c901f21e006624c5145f13", name: "1" },
      { _id: "67c901f21e006624c5145f14", name: "2" },
      { _id: "67c901f21e006624c5145f15", name: "3" },
    ];

    for (const user of users) {
      await Useree.findOneAndUpdate({ _id: user._id }, user, {
        upsert: true,
        new: true,
      });
    }

    console.log("샘플 유저 데이터 생성 완료");
  } catch (error) {
    console.error("샘플 유저 데이터 생성 실패:", error);
  }
};

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

    // 채팅 메시지 처리
    socket.on("chat message", (msg) => {
      console.log("메시지 수신:", msg);

      // 메시지 저장
      const newMessage = new Message({
        roomId: msg.roomId,
        text: msg.text,
        senderId: msg.senderId,
        time: msg.time,
        isRead: false, // 기본적으로 메시지는 안 읽음 상태로 저장
      });

      newMessage
        .save()
        .then(async (savedMessage) => {
          console.log("메시지 저장 성공:", savedMessage);

          // 해당 채팅방에 있는 모든 소켓에게 메시지 전송 (1:1 통신 보장)
          io.to(msg.roomId).emit("chat message", msg);

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

// 서버 초기화 함수
export const initializeChatServer = async () => {
  await ensureUsersExist();
  setupSocketHandlers();
  console.log("채팅 서버 초기화 완료");
};

// ---- API 라우트 정의 ----

// 사용자 정보 조회 API
router.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await Useree.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// 사용자 목록 조회 API
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await Useree.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
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

export default router;
