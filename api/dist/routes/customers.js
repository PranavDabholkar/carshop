"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const customerController_1 = require("../controllers/customerController");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
const customerSchema = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any').withMessage('Please provide a valid phone number'),
    (0, express_validator_1.body)('address').optional().trim(),
];
router.get('/', requireAuth_1.requireAuth, customerController_1.customerController.getAllCustomers);
router.get('/:id', requireAuth_1.requireAuth, customerController_1.customerController.getCustomerById);
router.post('/', requireAuth_1.requireAuth, customerSchema, validateRequest_1.validateRequest, customerController_1.customerController.createCustomer);
router.put('/:id', requireAuth_1.requireAuth, customerSchema, validateRequest_1.validateRequest, customerController_1.customerController.updateCustomer);
router.delete('/:id', requireAuth_1.requireAuth, customerController_1.customerController.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customers.js.map