// src/utils/Response.js

const successResponse = (res, message, data = {}, code = 200) => {
    return res.status(code).json({
        success: true,
        message,
        data,
    });
};

const onErrorResponse = (res, { code = 500, message = 'Something went wrong', error = null }) => {
    return res.status(code).json({
        success: false,
        message,
        error,
    });
};

module.exports = {
    successResponse,
    onErrorResponse,
};
