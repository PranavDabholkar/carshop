"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.['token'];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env['JWT_SECRET'] || 'fallback-secret');
        req.userId = decoded.userId;
        next();
    }
    catch {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}
//# sourceMappingURL=requireAuth.js.map