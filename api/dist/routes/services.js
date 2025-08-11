"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const serviceController_1 = require("../controllers/serviceController");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
const serviceSchema = [
    (0, express_validator_1.body)('type').trim().isLength({ min: 1 }).withMessage('Service type is required'),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('cost').toFloat().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    (0, express_validator_1.body)('scheduledAt').isISO8601().withMessage('Please provide a valid date'),
    (0, express_validator_1.body)('customerId').isString().trim().isLength({ min: 1 }).withMessage('Valid customer ID is required'),
    (0, express_validator_1.body)('vehicleId').isString().trim().isLength({ min: 1 }).withMessage('Valid vehicle ID is required'),
];
router.get('/', requireAuth_1.requireAuth, serviceController_1.serviceController.getAllServices);
router.get('/:id', requireAuth_1.requireAuth, serviceController_1.serviceController.getServiceById);
router.post('/', requireAuth_1.requireAuth, serviceSchema, validateRequest_1.validateRequest, serviceController_1.serviceController.createService);
router.put('/:id', requireAuth_1.requireAuth, serviceSchema, validateRequest_1.validateRequest, serviceController_1.serviceController.updateService);
router.delete('/:id', requireAuth_1.requireAuth, serviceController_1.serviceController.deleteService);
router.patch('/:id/status', requireAuth_1.requireAuth, (0, express_validator_1.body)('status').isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'), validateRequest_1.validateRequest, serviceController_1.serviceController.updateServiceStatus);
exports.default = router;
//# sourceMappingURL=services.js.map