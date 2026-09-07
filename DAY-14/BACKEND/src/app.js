const express = require("express")
const connectToDB = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require('cors')

const authRouter = require("./routes/auth.routes")
const postRouter = require('./routes/post.routes')
const userRouter = require("./routes/user.routes")

connectToDB()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

module.exports = app