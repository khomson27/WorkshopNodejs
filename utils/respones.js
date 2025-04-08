const sendResponse = (res, statusCode , message , data = null) => {
    return res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: data,
    });
};

module.exports = {
    sendResponse
};