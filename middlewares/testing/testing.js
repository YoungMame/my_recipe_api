const testingLog = (req, res, next) => {
    console.log(`${req.originalUrl} with ${req.method} was received`);
    next();
}

module.exports = {
    testingLog
}