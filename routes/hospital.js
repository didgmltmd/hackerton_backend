const express = require("express");
const router = express.Router();
const hospitalService = require("../services/hospitalService");

router.get("/nearby", async (req, res) => {
  const { lat, lng, radius, subject } = req.query;
  try {
    const hospitals = await hospitalService.getHospitalsBySubject({ lat, lng, radius, subject });
    res.json(hospitals);
} catch (err) {
    console.error("🔥 병원 정보 API 호출 중 오류:", err.response?.data || err.message || err);
    throw new Error("병원 데이터를 가져오는 데 실패했습니다.");
  }
  
});

module.exports = router;
