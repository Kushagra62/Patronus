import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const userVerify = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        if (!verify) {
            return res.status(401).json({ message: "Unauthorized, invalid token provided" });
        }

        const user = await User.findById(verify.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Unauthorized, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}