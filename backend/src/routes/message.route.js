import express from "express";
import { getMessages, sidebarUsers,sendMessage } from "../controllers/message.controllers.js";
import { userVerify } from "../middleware/auth.middleware.js";
const router= express.Router();
router.get("/users",userVerify,sidebarUsers );
router.get("/:id",userVerify,getMessages);
router.post("/send/:id", userVerify, sendMessage);
export default router;