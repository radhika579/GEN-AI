const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") })
const app = require("./app")
const connectToDB = require("./config/database")
const generateInterviewReport = require("./services/ai.service")
const { resume, selfDescription, jobDescription } = require("./services/temp")

connectToDB()

generateInterviewReport({ resume, selfDescription, jobDescription })
    .then(() => console.log('Interview report generated'))
    .catch((err) => console.error('Interview report generation failed:', err))

console.log("iaminsideserver.js")
app.listen(3000, ()=> {
    console.log("server is running on port 3000")
})