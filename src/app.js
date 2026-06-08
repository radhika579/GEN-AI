const express = require("express")


const app = express()

app.use(express.json())

/* require all the routes here */
const authRouter = require("./routes/auth.routes")

/* using all the routes */
app.use("/api/auth", authRouter)


console.log("iaminsideapp.js")

module.exports = app