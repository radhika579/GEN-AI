const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const authrouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authrouter.post("/register",authController.registerUserController)

module.exports = authrouter