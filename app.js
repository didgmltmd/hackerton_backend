const express = require("express");
require("dotenv").config();

const app = express();
const hospitalRoutes = require("./routes/hospital.js");

app.use(express.json());
app.use("/api/hospitals", hospitalRoutes);
console.log("KEY", process.env.HIRA_SERVICE_KEY);


const PORT = 3000;

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
