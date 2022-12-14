import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userSchema from "../models/User.js";
import makeHash from "../utility/hash.js";
import CreateToken from "../utility/jwt.js";
import { accountActivationEmail } from "../utility/nodemailer.js";
import validateMessage from "../utility/validate.js";
/**
 * @get route
 * @ login page
 */
const loginController = (req, res) => {
	res.render("login");
};

/**
 * @get route
 * @ register page
 */

const registerController = (req, res) => {
	res.render("register");
};

/**
 * @get route
 * @profile page
 */

const profileController = (req, res) => {
	res.render("profile");
};

/**
 * @get route
 * @photo page
 */

const profilePhotoController = (req, res) => {
	res.render("photo");
};

/**
 * @get route
 * @change password
 */

const changePasswordController = (req, res) => {
	res.render("change");
};

/**
 * @get route
 * @find friends
 */

const findFriendsController = async (req, res) => {
	try {
		const users = await userSchema
			.find()
			.where("email")
			.ne(req.session.user.email);
		res.render("friends", {
			users,
		});
	} catch (error) {
		validateMessage(req, res, error.message, "/find-friends");
	}
};

/**
 * @get @username  single friends controller
 */
const singlefriendController = async (req, res) => {
	try {
		const profile = await userSchema.findOne({ username: req.params.username });

		res.render("single-profile", {
			profile: profile,
		});
	} catch (error) {
		validateMessage(req, res, error.message, "/find-friends");
	}
};

/**
 * @get route
 * @gallery page
 */

const galleryController = async (req, res) => {
	res.render("gallery", {
		user: req.session.user,
	});
};

/**
 * @post Router
 * galleryControllerPost
 */

const galleryControllerPost = async (req, res) => {
	try {
		for (let i = 0; i < req.files.gallery.length; i++) {
			console.log(req.files[i]);
			const user = await userSchema.findByIdAndUpdate(req.session.user._id, {
				$push: {
					gallery: req.files.gallery[i].filename,
				},
			});
			// session update
			req.session.user = user;
		}

		validateMessage(req, res, "Gallery updated successfully", "/gall");
	} catch (error) {}
};

/**
 * @post route
 * @register page
 */

const registerControllerPost = async (req, res) => {
	try {
		const { name, email, username, password } = req.body;

		/**
		 * validate
		 */

		if (!name || !email || !username || !password) {
			validateMessage(req, res, "All Fields are required !", "/register");
		} else {
			const userExist = await userSchema.findOne({ email });

			if (userExist) {
				validateMessage(req, res, "User already exist", "/register");
			} else {
				const user = await userSchema.create({
					name,
					email,
					username,
					password: makeHash(password),
				});
				const token = CreateToken(user._id, "3d");
				const activationLink = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`;

				await accountActivationEmail(email, {
					name: name,
					activationLInk: activationLink,
				});
				validateMessage(req, res, "User created successfully!", "/login");
			}
		}
	} catch (error) {
		console.log(error.message);
	}
};

/**
 * @post Login Controller
 */
const loginControllerauth = async (req, res) => {
	try {
		const { email, password } = req.body;
		/**
		 *validation
		 */

		if (!email) {
			validateMessage(req, res, "Please enter your email", "/login");
		} else if (!password) {
			validateMessage(req, res, "Please enter your password", "/login");
		} else {
			const isexistEmail = await userSchema.findOne({ email });
			const passwordMatch = bcrypt.compareSync(password, isexistEmail.password);
			if (!isexistEmail) {
				validateMessage(req, res, "Email does not exist !", "/login");
			} else if (!passwordMatch) {
				validateMessage(req, res, "Password is incorrect !", "/login");
			} else {
				if (!isexistEmail.isActive) {
					validateMessage(req, res, " Please active your account", "/login");
				} else {
					const token = CreateToken(isexistEmail._id, "3d");
					// create token
					res.cookie("authToken", token);
					// create session
					req.session.user = isexistEmail;
					validateMessage(req, res, "Login successfully", "/");
				}
			}
		}
	} catch (error) {
		validateMessage(req, res, error.message, "/login");
	}
};

/*
 * @ loggout controller
 */

const loggoutController = (req, res) => {
	delete req.session.user;
	res.clearCookie("authToken");
	validateMessage(req, res, "You have been loggout ", "/login");
};

/**
 * user account activation
 */

const userAccountactivation = (req, res) => {
	try {
		const { token } = req.params;
		const jwtVerifyToken = jwt.verify(token, process.env.JWT_SECRET);
		if (jwtVerifyToken) {
			userSchema.findOneAndUpdate(
				{ _id: jwtVerifyToken.id },
				{ isActive: true },
				(err, data) => {
					if (err) {
						validateMessage(req, res, err.message, "/login");
					} else {
						validateMessage(
							req,
							res,
							"Account activated successfully",
							"/login"
						);
					}
				}
			);
		}
	} catch (error) {
		validateMessage(req, res, error.message, "/login");
	}
};

/**
 * profile photo upload controller
 */

const profilePhotoUploadController = async (req, res) => {
	try {
		const user = await userSchema.findByIdAndUpdate(req.session.user._id, {
			photo: req.files.profile_photo[0].filename,
		});
		// session update
		req.session.user = user;
		validateMessage(req, res, "Photo uploaded successfully", "/profile-photo");
	} catch (error) {
		validateMessage(req, res, error.message, "/profile-photo");
	}
};

/**
 * profile bg photo upload controller
 */

/**
 * password change controller
 */

const passwordChangController = async (req, res) => {
	try {
		const { oldpass, newpass, conpass } = req.body;
		const passmatch = bcrypt.compareSync(oldpass, req.session.user.password);
		// validate
		if (!oldpass) {
			validateMessage(
				req,
				res,
				"Please enter your old password",
				"/change-password"
			);
		} else if (!passmatch) {
			validateMessage(
				req,
				res,
				"Please enter your new password",
				"/change-password"
			);
		}

		// compare old to new password
		if (newpass != conpass) {
			validateMessage(req, res, "Passwords do not match", "/change-password");
		}
		// update user
		const user = await userSchema.findByIdAndUpdate(req.session.user._id, {
			password: makeHash(newpass),
		});
		req.session.user.password = user;
		validateMessage(
			req,
			res,
			"Password changed successfully",
			"/change-password"
		);
	} catch (error) {
		validateMessage(req, res, error.message, "/password-change");
	}
};

/**
 * @get profile bg photo upload controller
 */

const profileBgPhotoUploadController = async (req, res) => {
	res.render("cover-photo");
};

/**
 * @post profile bg photo upload controller
 */

const profileBgPhotoUploadControllerPost = async (req, res) => {
	try {
		console.log(req.files.profile_cover);
		const user = await userSchema.findByIdAndUpdate(req.session.user._id, {
			bgPhoto: req.files.profile_cover[0].filename,
		});
		// session update
		req.session.user = user;
		validateMessage(req, res, "Photo uploaded successfully", "/cover-photo");
	} catch (error) {
		validateMessage(req, res, error.message, "/cover-photo");
	}
};

/**
 * @get edit profile controller
 */

const editProfileController = async (req, res) => {
	try {
		const user = await userSchema.findById(req.session.user._id);
		res.render("edit-profile", {
			user,
		});
	} catch (error) {
		validateMessage(req, res, error.message, "/edit-profile");
	}
};

/**
 * @post edit profile controller
 */

const editProfileControllerPost = async (req, res) => {
	try {
		const { name, email, username } = req.body;
		const user = await userSchema.findByIdAndUpdate(req.session.user._id, {
			name,
			email,
			username,
		});
		/**
		 * session update
		 */
		req.session.user = user;
		validateMessage(req, res, "Profile updated successfully", "/edit-profile");
	} catch (error) {
		validateMessage(req, res, error.message, "/edit-profile");
	}
};

/**
 * @get follow user controller
 */

const followUserController = async (req, res) => {
	try {
		const { id } = req.params;
		const following = await userSchema.findByIdAndUpdate(req.session.user._id, {
			$push: {
				following: id,
			},
		});
		req.session.user.following.push(id);
		validateMessage(req, res, "Followed successfully", "/find-friends");
	} catch (error) {
		validateMessage(req, res, error.message, "/find-friends");
	}
};

/**
 * @get unfollow user controller
 */

const unfollowUserController = async (req, res) => {
	try {
		const { id } = req.params;
		const unfollow = await userSchema.findByIdAndUpdate(req.session.user._id, {
			$pull: {
				following: id,
			},
		});
		let updateList = req.session.user.following.filter((item) => item != id);
		req.session.user.following = updateList;
		validateMessage(req, res, "Unfollowed successfully", "/find-friends");
	} catch (error) {
		validateMessage(req, res, error.message, "/find-friends");
	}
}

/**
 * password reset controller
 */

const passwordResetController = async (req, res) => {
	res.render("password-reset");
}

/**
 * password reset controller post
 */
const passwordResetControllerPost = async (req, res) => {}

export {
	loginController,
	registerController,
	profileController,
	profilePhotoController,
	changePasswordController,
	findFriendsController,
	galleryController,
	registerControllerPost,
	loginControllerauth,
	loggoutController,
	userAccountactivation,
	profilePhotoUploadController,
	passwordChangController,
	galleryControllerPost,
	profileBgPhotoUploadController,
	profileBgPhotoUploadControllerPost,
	editProfileController,
	editProfileControllerPost,
	singlefriendController,
	followUserController,
	unfollowUserController,
	passwordResetController,
	passwordResetControllerPost,
};
