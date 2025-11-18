import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Validators
export const validateSignup = [
  body("username").trim().notEmpty().withMessage("username is required"),
  body("email").isEmail().withMessage("valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("password min 6 chars")
];

export const validateLogin = [
  body("password").notEmpty().withMessage("password is required"),
  body().custom(b => {
    if (!b.email && !b.username) throw new Error("email or username is required");
    return true;
  })
];

// Controllers
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ status: false, errors: errors.array() });

  const { username, email, password } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists)
    return res.status(409).json({ status: false, message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });

  return res.status(201).json({
    message: "User created successfully.",
    user_id: user._id.toString()
  });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ status: false, errors: errors.array() });

  const { email, username, password } = req.body;

  const user = await User.findOne(email ? { email } : { username });
  if (!user)
    return res.status(401).json({ status: false, message: "Invalid Username and password" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res.status(401).json({ status: false, message: "Invalid Username and password" });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.status(200).json({ message: "Login successful.", jwt_token: token });
};