import bcrypt from "bcryptjs";
/**
 * make has and salt
 */

const makeHash = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};

export default makeHash;
