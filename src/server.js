require("dotenv").config()
const app = require("./app")
const connectToDB = require("./config/database")

console.log("iaminsideserver.js")
connectToDB()
app.listen(3000, ()=> {
    console.log("server is running on port 3000")
     
})