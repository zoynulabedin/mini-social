// authMiddleware

import validateMessage from "../utility/validate.js";

const authMiddleware = (req, res, next) => {
	const authToken = req.cookies.authToken;
	if (authToken) {
		validateMessage(req, res, "You are already loggin !", "/");
	} else {
		next();
	}
};

export default authMiddleware;
