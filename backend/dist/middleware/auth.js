"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.requireRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return (0, response_1.sendError)(res, 'No token provided', 401, 'NO_TOKEN');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.id;
        req.userType = decoded.userType;
        next();
    }
    catch (error) {
        (0, response_1.sendError)(res, 'Invalid token', 401, 'INVALID_TOKEN');
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.userType || !roles.includes(req.userType)) {
            return (0, response_1.sendError)(res, 'Insufficient permissions', 403, 'FORBIDDEN');
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireAuth = (req, res, next) => {
    if (!req.userId) {
        return (0, response_1.sendError)(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }
    next();
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map