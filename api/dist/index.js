"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const auth_1 = __importDefault(require("./routes/auth"));
const customers_1 = __importDefault(require("./routes/customers"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const services_1 = __importDefault(require("./routes/services"));
const activity_1 = __importDefault(require("./routes/activity"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env['PORT'] || 3001;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(limiter);
app.use((0, cors_1.default)({
    origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((req, _res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`);
    next();
});
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use('/api/auth', auth_1.default);
app.use('/api/customers', customers_1.default);
app.use('/api/vehicles', vehicles_1.default);
app.use('/api/services', services_1.default);
app.use('/api/activity', activity_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    logger_1.logger.info(`🚀 Server running on port ${PORT}`);
    logger_1.logger.info(`📊 Health check: http://localhost:${PORT}/health`);
    logger_1.logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
exports.default = app;
//# sourceMappingURL=index.js.map