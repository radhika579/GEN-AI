const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const authrouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authrouter.post("/register",authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description Login an existing user
 * @access Public
 */


authRouter.post("/api/login", authController.loginUserController)

module.exports = authrouter