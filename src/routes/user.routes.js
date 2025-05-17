import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// using multer middleware for upload avatar and coverImage to server(local)
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 2,
    },
    {
      name: "coverImage",
      maxCount: 2,
    },
  ]),
  
  registerUser
);

export default router

