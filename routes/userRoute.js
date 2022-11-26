import { Router } from "express";
import {
	changePasswordController,
	findFriendsController,
	galleryController,
	galleryControllerPost,
	loggoutController,
	loginController,
	loginControllerauth,
	passwordChangController,
	profileController,
	profilePhotoController,
	profilePhotoUploadController,
	registerController,
	registerControllerPost,
	userAccountactivation,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authRedirect from "../middlewares/authredirect.js";
import { gallery, upload } from "../utility/multer.js";

const router = Router();
router.route("/").get(authRedirect, profileController);
router
	.route("/login")
	.get(authMiddleware, loginController)
	.post(loginControllerauth);
router.route("/loggout").get(loggoutController);
router
	.route("/register")
	.get(authMiddleware, registerController)
	.post(registerControllerPost);
router
	.route("/profile-photo")
	.get(profilePhotoController)
	.post(upload, profilePhotoUploadController);

router
	.route("/change-password")
	.get(authRedirect, changePasswordController)
	.post(passwordChangController);
router.route("/find-friends").get(findFriendsController);
router
	.route("/gall")
	.get(authRedirect, galleryController)
	.post(gallery, galleryControllerPost);
router.route("/activate/:token").get(userAccountactivation);

export default router;
