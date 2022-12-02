import { Router } from "express";
import {
	changePasswordController,
	editProfileController,
	editProfileControllerPost,
	findFriendsController,
	followUserController,
	galleryController,
	galleryControllerPost,
	loggoutController,
	loginController,
	loginControllerauth,
	passwordChangController,
	passwordResetController,
	passwordResetControllerPost,
	profileBgPhotoUploadController,
	profileBgPhotoUploadControllerPost,
	profileController,
	profilePhotoController,
	profilePhotoUploadController,
	registerController,
	registerControllerPost,
	singlefriendController,
	unfollowUserController,
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
	.route("/password-reset")
	.get(passwordResetController)
	.post(passwordResetControllerPost);
router
	.route("/gall")
	.get(authRedirect, galleryController)
	.post(gallery, galleryControllerPost);
router.route("/activate/:token").get(userAccountactivation);
router.route("/:username").get(singlefriendController);
router.route("/follow/:id").get(authRedirect, followUserController);
router.route("/unfollow/:id").get(authRedirect, unfollowUserController);

export default router;
