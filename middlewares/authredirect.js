/**
 * auth redirect
 */

import validateMessage from "../utility/validate.js";

const authRedirect = (req, res, next) => {
	const authToken = req.cookies.authToken;
	if (!authToken) {
		validateMessage(req, res, "Please login first", "/login");
	} else {
		next();
	}
};

export default authRedirect;
