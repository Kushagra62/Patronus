import express from "express";
import { signup, login, logout, update, checkAuth } from "../controllers/auth.controllers.js";
import { userVerify } from "../middleware/auth.middleware.js";
const router= express.Router();
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout",logout)
router.put("/update-profile",userVerify,update)
router.get("/check",userVerify,checkAuth)
export default router;