const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Common validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, data: null, errors: errors.array() });
    }
    next();
};

// Validation for signup
const validateSignup = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Role ID must be a valid MongoDB ObjectId'),
    handleValidationErrors
];

// Validation for login
const validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// Update Single User
const validateUpdateUser = [
    body('firstName').optional().isString().withMessage('First name must be a string'),
    body('lastName').optional().isString().withMessage('Last name must be a string'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('role').optional().isMongoId().withMessage('Invalid role ID'),
    handleValidationErrors
];

// Validation for creating a role
const validateCreateRole = [
    body('roleName').notEmpty().withMessage('Role name is required'),
    body('accessModules')
        .isArray().withMessage('Access modules should be an array')
        .custom((modules) => modules.every(mod => typeof mod === 'string'))
        .withMessage('Each module should be a string'),
    handleValidationErrors
];

// Validation for updating a role
const validateUpdateRole = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Role ID must be a valid MongoDB ObjectId'),
    body('roleName').optional().notEmpty().withMessage('Role name is required'),
    body('accessModules').optional()
        .isArray().withMessage('Access modules should be an array')
        .custom((modules) => modules.every(mod => typeof mod === 'string'))
        .withMessage('Each module should be a string'),
    handleValidationErrors
];

// Validation for updating access modules
const validateUpdateAccessModules = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Role ID must be a valid MongoDB ObjectId'),
    body('moduleName').notEmpty().withMessage('Module name is required'),
    body('action').isIn(['add', 'remove']).withMessage('Action must be "add" or "remove"'),
    handleValidationErrors
];

// Validation for updating many users with the same data
const validateUpdateManyUsersSameData = [
    body().custom((value) => {
        // Ensure that there's at least one field to update
        if (Object.keys(value).length === 0) {
            throw new Error('At least one field is required for the update');
        }
        return true;
    }),
    // Optional: Validate specific fields if present
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
    handleValidationErrors
];

// Validation for updating many users with different data
const validateUpdateManyUsersDifferentData = [
    body('users').isArray().withMessage('Users should be an array'),
    body('users.*._id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('User ID must be a valid MongoDB ObjectId'),
    body('users.*.data').notEmpty().withMessage('Data to update is required'),
    handleValidationErrors
];

// Validation for checking access
const validateCheckAccess = [
    body('userId')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('User ID must be a valid MongoDB ObjectId'),
    body('moduleName').notEmpty().withMessage('Module name is required'),
    handleValidationErrors
];

module.exports = {
    validateSignup,
    validateLogin,
    validateCreateRole,
    validateUpdateRole,
    validateUpdateAccessModules,
    validateUpdateManyUsersSameData,
    validateUpdateManyUsersDifferentData,
    validateCheckAccess,
    validateUpdateUser
};
