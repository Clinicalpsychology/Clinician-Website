"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, statusCode = 200, message) => {
    const response = {
        success: true,
        data,
        timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 400, code) => {
    const response = {
        success: false,
        error: {
            message,
            code,
        },
        timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
class ApiError extends Error {
    constructor(message, statusCode = 400, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=response.js.map