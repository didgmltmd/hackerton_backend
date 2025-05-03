const axios = require("axios");
const xml2js = require("xml2js");
const injuryToSubject = require("../utils/symptomMap");
const SERVICE_KEY = process.env.HIRA_SERVICE_KEY;
const parser = new xml2js.Parser({ explicitArray: false });

/**
 * 위치 기반 병원 목록 조회
 */
async function getHospitalsByLocation({ lat, lng, radius = 2000 }) {
  const url = "https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList";

  try {
    const res = await axios.get(url, {
      params: {
        ServiceKey: SERVICE_KEY,
        xPos: lng,
        yPos: lat,
        radius,
        numOfRows: 100,
        pageNo: 1,
        _type: "json",
      },
    });

    const data = res.data;

    if (
      data?.response?.header?.resultCode !== "00" ||
      !data?.response?.body?.items
    ) {
      console.error("병원 API 응답 오류:", data?.response?.header);
      throw new Error("병원 목록을 불러오는 데 실패했습니다.");
    }

    return data.response.body.items.item || [];
  } catch (err) {
    console.error("병원 API 호출 실패:", err.response?.data || err.message);
    throw new Error("병원 목록을 가져오는 데 실패했습니다.");
  }
}

/**
 * 증상 기반으로 진료과 매핑하여 병원 필터링
 */
async function getHospitalsBySubject({ lat, lng, radius = 2000, injury }) {
  const subject = injuryToSubject[injury];
  if (!subject) throw new Error("알 수 없는 부위입니다.");

  const listUrl = "https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList";
  const res = await axios.get(listUrl, {
    params: {
      ServiceKey: SERVICE_KEY,
      xPos: lng,
      yPos: lat,
      radius,
      _type: "json",
      numOfRows: 100,
      pageNo: 1,
    },
  });

  const hospitals = res.data.response.body.items.item || [];
  const results = [];

  for (const hosp of hospitals) {
    try {
      const deptRes = await axios.get(
        "https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getDgsbjtInfo2.7",
        {
          params: {
            ServiceKey: SERVICE_KEY,
            ykiho: hosp.ykiho,
          },
          responseType: "text",
        }
      );

      const isXML = deptRes.data.trim().startsWith("<");

      let subjectItems = [];
      if (isXML) {
        const parsed = await parser.parseStringPromise(deptRes.data);
        subjectItems = parsed?.response?.body?.items?.item || [];
      } else {
        const parsed = JSON.parse(deptRes.data);
        subjectItems = parsed?.response?.body?.items?.item || [];
      }

      const hasSubject = Array.isArray(subjectItems)
        ? subjectItems.some((s) => s.dgsbjtCdNm === subject)
        : subjectItems?.dgsbjtCdNm === subject;

      if (hasSubject) results.push(hosp);
    } catch (err) {
      console.warn("진료과목 API 실패 (무시):", err.response?.data || err.message);
    }
  }

  return results;
}

module.exports = {
  getHospitalsByLocation,
  getHospitalsBySubject,
};
