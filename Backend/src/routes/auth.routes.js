const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const authrouter = Router()
const authMiddleware = require("../middlewares/auth.middlewares")
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


authrouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description Clear token from cookie and add token in blacklist
 * @access public
 */

authrouter.get("/logout", authController.logoutUserController)

/**
*@route GET /api/auth/get-me 
*@description Get the current logged in user details
*@access Private
 */
authrouter.get('/get-me', authMiddleware.authUser,authController.getMeController)

module.exports = authrouter