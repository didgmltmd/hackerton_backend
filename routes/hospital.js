const express = require("express");
const router = express.Router();
const { getHospitalsByLocation, getHospitalsBySubject } = require("../services/hospitalService");

/**
 * @swagger
 * /api/hospitals/nearby:
 *   get:
 *     summary: 현재 위치 기준으로 반경 내 병원 목록 조회
 *     tags:
 *       - 병원
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: 위도
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: 경도
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: number
 *           default: 2000
 *         description: 검색 반경 (미터 단위)
 *     responses:
 *       200:
 *         description: 병원 목록 응답
 */
router.get("/nearby", async (req, res) => {
  const { lat, lng, radius = 2000 } = req.query;

  try {
    const hospitals = await getHospitalsByLocation({ lat, lng, radius });
    res.json(hospitals);
  } catch (err) {
    console.error("병원 API 에러:", err.message);
    res.status(500).json({ error: "병원 목록을 가져오는 데 실패했습니다." });
  }
});

/**
 * @swagger
 * /api/hospitals/by-injury:
 *   get:
 *     summary: 증상 기반으로 진료과 필터링된 병원 목록 조회
 *     tags:
 *       - 병원
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: 위도
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: 경도
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: number
 *           default: 2000
 *         description: 검색 반경
 *       - in: query
 *         name: injury
 *         required: true
 *         schema:
 *           type: string
 *         description: "다친 부위 (예: 허리디스크, 눈, 무릎 등)"
 *     responses:
 *       200:
 *         description: 필터링된 병원 목록
 */
router.get("/by-injury", async (req, res) => {
  const { lat, lng, radius = 2000, injury } = req.query;

  try {
    const hospitals = await getHospitalsBySubject({ lat, lng, radius, injury });
    res.json(hospitals);
  } catch (err) {
    console.error("진료과 필터링 실패:", err.message);
    res.status(500).json({ error: "병원 필터링 실패" });
  }
});

module.exports = router;
