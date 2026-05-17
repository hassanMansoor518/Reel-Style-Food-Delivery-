const foodPartnerModel = require("../model/foodPartner.model")
const userModel = require("../model/user.model")
const jwt = require("jsonwebtoken");


async function foodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "please login first"
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const foodPartner = await foodPartnerModel.findById(decode.id)

        if (!foodPartner) {
            return res.status(401).json({ message: "Invalid token user not found" })
        }

        req.foodPartner = foodPartner
        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

async function userMiddleware(req,res,next) {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"please login first"
        })
    }

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decode.id)

        if (!user) {
            return res.status(401).json({ message: "Invalid token user not found" })
        }

        req.user = user
        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}
async function auth(req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user find
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // store in request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
}


module.exports = {
    foodPartnerMiddleware,
    userMiddleware,
    auth
}

