import multer from "multer";
import path from "path";
import validateMessage from "./validate.js";
const __dirname = path.resolve();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (req.files.profile_photo) {
			if (
				file.mimetype === "image/jpeg" ||
				file.mimetype === "image/png" ||
				file.mimetype === "image/jpg"
			) {
				cb(null, path.join(__dirname, "public/images"));
			} else {
				validateMessage(
					req,
					res,
					"Only jpeg, jpg and png files are allowed",
					"/profile-photo"
				);
			}
		} else if (req.files.gallery) {
			if (
				file.mimetype === "image/jpeg" ||
				file.mimetype === "image/png" ||
				file.mimetype === "image/jpg"
			) {
				cb(null, path.join(__dirname, "public/gallery"));
			} else {
				validateMessage(
					req,
					res,
					"Only jpeg, jpg and png files are allowed",
					"/gallery"
				);
			}
		} else if (req.files.profile_cover) {
			if (
				file.mimetype === "image/jpeg" ||
				file.mimetype === "image/png" ||
				file.mimetype === "image/jpg"
			) {
				cb(null, path.join(__dirname, "public/cover"));
			} else {
				validateMessage(
					req,
					res,
					"Only jpeg, jpg and png files are allowed",
					"/cover-photo"
				);
			}
		}
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "_" + file.originalname);
	},
});

// profile pic
const upload = multer({
	storage: storage,
}).fields([{ name: "profile_photo", maxCount: 1 }]);

// gallery
const gallery = multer({
	storage: storage,
}).fields([{ name: "gallery", maxCount: 15 }]);

// cover photo

const cover = multer({
	storage: storage,
}).fields([{ name: "profile_cover", maxCount: 1 }]);

export { upload, gallery, cover };
