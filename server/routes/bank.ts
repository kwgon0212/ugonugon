import express, { response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const router = express.Router();
/**
 * @swagger
 * /api/bank:
 *   post:
 *     summary: 계좌 및 거래 정보
 *     tags: [Bank - 계좌]
 *     description: 핀 어카운트 직접발급확인, 직접발급, 잔액조회, 입금이체, 거래내역조회
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

const BanksSchema = new mongoose.Schema({
  IsTuno: { type: Number, unique: true },
  request: { type: Object, required: true },
  response: { type: Object },
});
const Banks = mongoose.model("banks", BanksSchema);

const url = (ApiNm: string) =>
  "https://developers.nonghyup.com/" + ApiNm + ".nh";

dotenv.config();
const FintechApsno = "001";
const ApiSvcCd = "DrawingTransferA";
const Iscd = process.env.Iscd;
const AccessToken = process.env.AccessToken;

router.post("/", async (req, res) => {
  try {
    const LastIsTuno = await mongoose
      .model("banks")
      .findOne()
      .sort({ IsTuno: -1 })
      .exec();
    const CurrentIsTuno = LastIsTuno.IsTuno ? LastIsTuno.IsTuno + 1 : 1;

    req.body.Header.IsTuno = CurrentIsTuno;
    if (req.body.FinAcno) {
      req.body.FinAcno =
        req.body.account === "3020000012625"
          ? "00820100028990000000000026652"
          : process.env.FinAcno;
    }

    req.body.Header.FintechApsno = FintechApsno;
    req.body.Header.ApiSvcCd = ApiSvcCd;
    req.body.Header.Iscd = Iscd;
    req.body.Header.AccessToken = AccessToken;

    let bank = new Banks({
      IsTuno: CurrentIsTuno,
      request: req.body,
    });
    const reqBank = await bank.save();
    const resBank = await fetch(url(req.body.Header.ApiNm), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const finalRes = await resBank.json();
    bank.request = req.body;
    bank.response = finalRes;

    await Banks.findByIdAndUpdate(reqBank._id, bank);
    res.status(200).json(finalRes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
