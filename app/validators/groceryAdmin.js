const { body, param, query, validationResult } = require('express-validator');

const validateAddGrocery = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateViewGroceries = [
  query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number, must be a positive integer'),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid page size, must be between 1 and 100'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateUpdateGrocery = [
  param('id').isInt().withMessage('Invalid ID'),
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateManageInventory = [
  param('id').isInt().withMessage('Invalid ID'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateAddGrocery,
  validateViewGroceries,
  validateUpdateGrocery,
  validateManageInventory
};
