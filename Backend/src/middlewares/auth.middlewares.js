const jwt = require("jsonwebtoken")



function authUser(req, res, next) {
    // Accept token from cookie or Authorization header (Bearer)
    const cookieToken = req.cookies && req.cookies.token
    const headerToken = req.headers && req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    const token = cookieToken || headerToken

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

}





module.exports = {authUser}