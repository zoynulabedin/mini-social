import multer from "multer";
import path from "path";
import validateMessage from "./validate.js";
const __dirname = path.resolve();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log(req.files);
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
		}
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({
	storage: storage,
}).fields([
	{ name: "profile_photo", maxCount: 1 }
]);

export default upload;
