const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
/* require all the routes here */
const authRouter = require("./routes/auth.routes")

/* using all the routes */
app.use("/api/auth", authRouter)


console.log("iaminsideapp.js")

module.exports = app