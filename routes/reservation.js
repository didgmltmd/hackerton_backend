const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const reservationFile = path.join(__dirname, "../data/reservations.json");

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: 병원 예약 생성
 *     tags:
 *       - 예약
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - rrn
 *               - injury
 *               - hospital
 *             properties:
 *               name:
 *                 type: string
 *                 example: 양희승
 *               age:
 *                 type: integer
 *                 example: 23
 *               rrn:
 *                 type: string
 *                 example: 000101-1234567
 *               injury:
 *                 type: string
 *                 example: 골절
 *               hospital:
 *                 type: string
 *                 example: 고도일병원
 *     responses:
 *       201:
 *         description: 예약 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post("/", (req, res) => {
  const { name, age, rrn, injury, hospital } = req.body;

  if (!name || !age || !rrn || !injury || !hospital) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  const reservation = {
    id: Date.now(),
    name,
    age,
    rrn,
    injury,
    hospital,
    timestamp: new Date().toISOString(),
  };

  let reservations = [];
  if (fs.existsSync(reservationFile)) {
    const raw = fs.readFileSync(reservationFile, "utf-8");
    reservations = JSON.parse(raw || "[]");
  }

  reservations.push(reservation);
  fs.writeFileSync(reservationFile, JSON.stringify(reservations, null, 2));

  res.status(201).json({
    message: "예약 성공",
    reservation,
  });
});

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: 전체 예약 목록 조회
 *     tags:
 *       - 예약
 *     responses:
 *       200:
 *         description: 예약 목록 반환
 */
router.get("/", (req, res) => {
  if (!fs.existsSync(reservationFile)) {
    return res.json([]);
  }

  const raw = fs.readFileSync(reservationFile, "utf-8");
  const reservations = JSON.parse(raw || "[]");

  res.json(reservations);
});

module.exports = router;
