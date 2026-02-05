const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnecttoDb = require("./config/db");
const router = require("./routes/userRoute");

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://resume-builder-p.netlify.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => res.send("Backend Running"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

ConnecttoDb()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err.message));
