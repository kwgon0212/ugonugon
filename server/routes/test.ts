import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: 테스트 API
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
 *                     example: "test"
 */
router.get("/", (req, res) => {
  res.status(200).json({ message: "test" });
});

export default router;
