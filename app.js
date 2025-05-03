const express = require("express");
require("dotenv").config();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Swagger 설정
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "병원 예약 API",
      version: "1.0.0",
      description: "위치 기반 병원 조회 및 예약 시스템",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"], // Swagger 주석이 작성될 파일 경로
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// 미들웨어
app.use(cors());
app.use(express.json());

// Swagger 라우터
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API 라우터
const hospitalRoutes = require("./routes/hospital");
const reservationRoutes = require("./routes/reservation");

app.use("/api/hospitals", hospitalRoutes);
app.use("/reservations", reservationRoutes);

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
  console.log(`Swagger docs on http://localhost:${PORT}/api-docs`);
});
