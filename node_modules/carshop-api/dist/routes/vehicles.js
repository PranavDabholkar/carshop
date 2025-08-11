"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const vehicleController_1 = require("../controllers/vehicleController");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
const vehicleSchema = [
    (0, express_validator_1.body)('make').trim().isLength({ min: 1 }).withMessage('Make is required'),
    (0, express_validator_1.body)('model').trim().isLength({ min: 1 }).withMessage('Model is required'),
    (0, express_validator_1.body)('year')
        .toInt()
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage('Please provide a valid year'),
    (0, express_validator_1.body)('vin').trim().isLength({ min: 8, max: 32 }).withMessage('VIN must be between 8 and 32 characters'),
    (0, express_validator_1.body)('licensePlate').optional().trim(),
    (0, express_validator_1.body)('color').optional().trim(),
    (0, express_validator_1.body)('mileage').optional().toInt().isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
    (0, express_validator_1.body)('customerId').isString().notEmpty().withMessage('Valid customer ID is required'),
];
router.get('/', requireAuth_1.requireAuth, vehicleController_1.vehicleController.getAllVehicles);
router.get('/:id', requireAuth_1.requireAuth, vehicleController_1.vehicleController.getVehicleById);
router.post('/', requireAuth_1.requireAuth, vehicleSchema, validateRequest_1.validateRequest, vehicleController_1.vehicleController.createVehicle);
router.put('/:id', requireAuth_1.requireAuth, vehicleSchema, validateRequest_1.validateRequest, vehicleController_1.vehicleController.updateVehicle);
router.delete('/:id', requireAuth_1.requireAuth, vehicleController_1.vehicleController.deleteVehicle);
router.patch('/:id/status', requireAuth_1.requireAuth, (0, express_validator_1.body)('status').isIn(['ACTIVE', 'IN_SERVICE', 'INACTIVE']).withMessage('Invalid status'), validateRequest_1.validateRequest, vehicleController_1.vehicleController.updateVehicleStatus);
exports.default = router;
//# sourceMappingURL=vehicles.js.map