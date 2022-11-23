import jwt from "jsonwebtoken";

/*
 * create Token
 **/

const CreateToken = (id, exp = "365d") => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: exp,
	});
};

export default CreateToken;
