const catchAsync = (passedFunction) => (req, res, next) => {
    return Promise.resolve(passedFunction(req, res, next)).catch(next);
};
export default catchAsync;
