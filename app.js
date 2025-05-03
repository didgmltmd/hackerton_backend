const express = require("express");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();

// CORS 설정 (모든 origin 허용, 실제 배포시 origin 제한 가능)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

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
        url: process.env.SWAGGER_URL || "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 라우터
const hospitalRoutes = require("./routes/hospital");
const reservationRoutes = require("./routes/reservation");

app.use("/api/hospitals", hospitalRoutes);
app.use("/reservations", reservationRoutes);

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
  console.log(`Swagger docs on http://localhost:${PORT}/api-docs`);
});
