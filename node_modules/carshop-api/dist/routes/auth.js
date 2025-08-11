"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
const loginSchema = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
const registerSchema = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
router.post('/login', loginSchema, validateRequest_1.validateRequest, authController_1.authController.login);
router.post('/register', registerSchema, validateRequest_1.validateRequest, authController_1.authController.register);
router.post('/logout', authController_1.authController.logout);
router.get('/me', authController_1.authController.getCurrentUser);
exports.default = router;
//# sourceMappingURL=auth.js.map