/**
 * validate message
 */

const validateMessage = (req,res,msg, redirect) => {
    req.session.message = msg;
    res.redirect(redirect);
}
export default validateMessage;