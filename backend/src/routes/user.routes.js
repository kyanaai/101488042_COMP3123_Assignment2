import { Router } from "express";
import { signup, login, validateSignup, validateLogin } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", validateSignup, signup); // 201
router.post("/login",  validateLogin,  login);  // 200

export default router;