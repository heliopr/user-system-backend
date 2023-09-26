module.exports = function(err, req, res, next) {
    res.json({
        success: false,
        errorCode: err.statusCode,
        errorMessage: err.message || "ERROR"
    })
}