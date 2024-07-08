import { Router } from "express";
import {
  avatarChange,
  changePassword,
  editProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
const router = Router();
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes

//logging out user
router.route("/logout").post(verifyJWT, logoutUser);

//refreshing access token for user
router.route("/refresh-Aceess-token").post(verifyJWT, refreshAccessToken);

//updating password 
router.route("/passwordChange").post(verifyJWT, changePassword);

//updating user Profile changes
router.route("/editProfile").post(verifyJWT, editProfile);

//updating user's avatar and cover Image
router.route("/avatarEdit")
          .post(verifyJWT, upload.single("avatar"),avatarChange);

router.route("/updateCoverImage")
          .post(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

//All users endpoint
router.route("/allUsersDatabase").post()

export default router;
