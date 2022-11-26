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

const findFriendsController = (req, res) => {
	res.render("friends");
};

/**
 * @get route
 * @gallery page
 */

const galleryController = (req, res) => {
	res.render("gallery");
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
			photo: req.files.profile_photo[0].originalname,
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
		if(!oldpass){
			validateMessage(
				req,
				res,
				"Please enter your old password",
				"/change-password"
			);
		}else if(!passmatch){
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
			password: makeHash(newpass)
		});
        req.session.user.password = user;
		validateMessage(req, res, "Password changed successfully", "/change-password");

	} catch (error) {
		validateMessage(req, res, error.message, "/password-change");
	}
};

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
};
