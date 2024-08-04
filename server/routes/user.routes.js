import { Router } from "express";
import {
  forgotPassword,
  getLoggedInUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/authmiddleware.js";
import upload from "../middlewares/multermiddleware.js";

const router = Router();

router.post("/signup", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);//**since user can only logout if and only if he is logged in , so check if i have to use isLoggedIn middleware here or or 
router.get("/me", isLoggedIn, getLoggedInUserDetails);
router.post("/reset", forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateUser);

export default router;
