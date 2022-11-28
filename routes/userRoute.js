import { Router } from "express";
import {
	changePasswordController,
	editProfileController,
	editProfileControllerPost,
	findFriendsController,
	galleryController,
	galleryControllerPost,
	loggoutController,
	loginController,
	loginControllerauth,
	passwordChangController,
	profileBgPhotoUploadController,
	profileBgPhotoUploadControllerPost,
	profileController,
	profilePhotoController,
	profilePhotoUploadController,
	registerController,
	registerControllerPost,
	singlefriendController,
	userAccountactivation,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authRedirect from "../middlewares/authredirect.js";
import { cover, gallery, upload } from "../utility/multer.js";

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
	.route("/edit-profile")
	.get(authRedirect, editProfileController)
	.post(editProfileControllerPost);
router
	.route("/profile-photo")
	.get(profilePhotoController)
	.post(upload, profilePhotoUploadController);
router
	.route("/cover-photo")
	.get(profileBgPhotoUploadController)
	.post(cover, profileBgPhotoUploadControllerPost);
router
	.route("/change-password")
	.get(authRedirect, changePasswordController)
	.post(passwordChangController);
router.route("/find-friends").get(authRedirect, findFriendsController);

router
	.route("/gall")
	.get(authRedirect, galleryController)
	.post(gallery, galleryControllerPost);
router.route("/activate/:token").get(userAccountactivation);
router.route("/:username").get(singlefriendController);

export default router;
