const mongoose = require("mongoose")



async function connectToDB() {
   
    try{
    await mongoose.connect("mongodb+srv://radhika:VzlYvHjBxHb3rYpR@interview-ai-cluster.xyxak2n.mongodb.net/interview-master")

    console.log("Connected to Database")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectToDB