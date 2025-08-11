"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.authController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists',
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env['JWT_SECRET'] || 'fallback-secret', { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { user },
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env['JWT_SECRET'] || 'fallback-secret', { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                },
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
    async logout(_req, res) {
        res.clearCookie('token');
        res.json({
            success: true,
            message: 'Logout successful',
        });
    },
    async getCurrentUser(req, res) {
        try {
            const token = req.cookies['token'];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided',
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env['JWT_SECRET'] || 'fallback-secret');
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }
            res.json({
                success: true,
                data: { user },
            });
        }
        catch (error) {
            console.error('Get current user error:', error);
            res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }
    },
};
exports.default = exports.authController;
//# sourceMappingURL=authController.js.map