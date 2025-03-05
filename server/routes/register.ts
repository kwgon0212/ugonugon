import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const router = express.Router();

const UserSchema = new mongoose.Schema({
  businessNumber: [String],
  emailCert: Boolean,
  emailCode: Number,
  address: { zipcode: String, street: String, detail: String },
  bankAccount: { bank: String, account: String },
  name: String,
  sex: String,
  residentId: String,
  phone: String,
  signature: String,
  email: String,
  password: String,
});

// mongoDB document 객체
// mongoDB에서는 모델 이름의 소문자+복수형(s)가 자동으로 컬렉션명이 됨
const User = mongoose.model("user", UserSchema);

router.post("/", async (req, res) => {
  const { password, signature, ...userInfo } = req.body;
  const tempSignature = "@@@";
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    ...userInfo,
    password: hashedPassword,
    signature: tempSignature,
  });
  try {
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(201).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
