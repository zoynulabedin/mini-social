/**
 * const locals middleware
 */

export const localsMiddleware = (req, res, next) => {
	res.locals.message = req.session.message;
	delete req.session.message;

	next();
};
