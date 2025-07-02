/**
 * Wrap async function to catch errors and pass to next().
 */
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
export default catchAsync;
