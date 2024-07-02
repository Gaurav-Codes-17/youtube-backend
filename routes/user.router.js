import {Router} from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
const router = Router()
import  {upload}  from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

  router.route("/login").post(loginUser)



  //secured route
  router.route("/logout").post(verifyJWT, logoutUser);
  router.route("/refresh-Aceess-token").post(verifyJWT , refreshAccessToken)

export default router