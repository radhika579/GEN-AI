const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required")
}

/**
 * @route POST /api/auth/register
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */

    async function registerUserController(req, res) { 

         const {username, email, password} = req.body

         if(!username || !email || !password){
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
         }

         const isUserAlreadyExists = await userModel.findOne({
            $or: [ {username}, {email} ]
         })
        /* isUserAlreadyExists.username == username */
            if(isUserAlreadyExists){
                return res.status(400).json({
                    message: "User with this username or email already exists"
                })
            }


            const hash = await bcrypt.hash(password, 10)

            const User = await userModel.create({
                username,
                email,
                password: hash
            })

            const token = jwt.sign(
                { userId: User._id }, 
                JWT_SECRET, 
                { expiresIn: "1d" }
            )
            res.cookie("token", token)

            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: User._id,
                    username: User.username,
                    email: User.email
                },
                
            })
    }

    /** 
    *@name loginUserController
    *@description Login an existing user, expects email and password in the request body
    *@access Public 
    */
   async function loginUserController(req, res) {

    const {email, password} = req.body

    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }


    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token) 
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports = {
    registerUserController,
    loginUserController 
}