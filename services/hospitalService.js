const axios = require("axios");
const SERVICE_KEY = process.env.HIRA_SERVICE_KEY;

async function getHospitalsBySubject({ lat, lng, radius = 2000, subject }) {
  const hospListUrl = `https://apis.data.go.kr/B551182/hospInfoService1/getHospBasisList1`;
  const results = [];

  console.log("📤 병원 리스트 요청 보내기:");
console.log("xPos:", lng);
console.log("yPos:", lat);
console.log("radius:", radius);
console.log("serviceKey:", SERVICE_KEY.slice(0, 10) + "..."); // 전체 키 노출 방지

  try {
    // 1. 위치 기반 병원 목록 조회
    const hospRes = await axios.get(hospListUrl, {
      params: {
        serviceKey: SERVICE_KEY,
        xPos: lng,
        yPos: lat,
        radius: radius,
        numOfRows: 100,
        pageNo: 1,
        _type: "json",
      },
    });

    const hospitals = hospRes.data.response.body.items?.item || [];

    for (const hosp of hospitals) {
      const ykiho = hosp.ykiho;

      // 2. 진료과목 조회
      const deptRes = await axios.get(
        `https://apis.data.go.kr/B551182/medicInsttInfoService1/getMdcinSpcltyList1`,
        {
          params: {
            serviceKey: SERVICE_KEY,
            ykiho: ykiho,
            _type: "json",
          },
        }
      );

      const subjects = deptRes.data.response.body.items?.item || [];

      const hasSubject = subjects.some(
        (s) => s.dgsbjtCdNm === subject
      );

      if (hasSubject) {
        results.push({
          name: hosp.yadmNm,
          addr: hosp.addr,
          tel: hosp.telno,
          lat: hosp.YPos,
          lng: hosp.XPos,
          subject: subject,
        });
      }
    }

    return results;
} catch (err) {
    console.log("🔥🔥🔥 병원 데이터 요청 중 오류 발생");
    console.log("🔻 에러 전체 객체:", err);
    console.log("🔻 err.response?.data:", err.response?.data);
    console.log("🔻 err.message:", err.message);
    throw new Error("병원 데이터를 가져오는 데 실패했습니다.");
  }
  
}

module.exports = { getHospitalsBySubject };
