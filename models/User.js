import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		default: "default.png",
	},
	bgPhoto: {
		type: String,
		default: "bgPhoto.png",
	},
	gallery: {
		type: Array,
	},
	followers: {
		type: Array,
	},
	following: {
		type: Array,
	},
	location: {
		type: String,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	token: {
		type: String,
	},
	accessToken: {
		type: String,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

export default mongoose.model("User", UserSchema);
