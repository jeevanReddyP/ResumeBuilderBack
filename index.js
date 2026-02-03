const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnecttoDb = require("./config/db");

const router = require("./routes/userRoute");


dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Better startup
ConnecttoDb()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });
