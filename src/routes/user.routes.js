import { Router } from "express";
import {
  changeCurrentUserPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
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

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentUserPassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyJwt, getUserChannelProfile);
router.route("/history").get(verifyJwt, getWatchHistory);


export default router

