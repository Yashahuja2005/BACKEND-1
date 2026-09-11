const express = require("express")
const cookieParser = require("cookie-parser");
const router = require("./routes/auth.routes");
const cors = require("cors")
const songRoutes = require("./routes/song.routes")

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", router)
app.use("/api/songs", songRoutes)

module.exports = app