import { Router } from "express";
const router = Router();

import { registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multermiddleware.js";

router
.post("/register" ,upload.single("avatar"), registerUser);

export default router;