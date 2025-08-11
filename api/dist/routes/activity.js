"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const activityController_1 = require("../controllers/activityController");
const router = (0, express_1.Router)();
router.get('/recent', requireAuth_1.requireAuth, activityController_1.activityController.getRecentActivity);
exports.default = router;
//# sourceMappingURL=activity.js.map