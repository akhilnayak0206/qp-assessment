const { query, validationResult } = require('express-validator');

const validateViewAvailableGroceries = [
  query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number, must be a positive integer'),
  query('pageSize').optional().isInt({ min: 1 }).withMessage('Invalid page size, should be more than 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateViewAvailableGroceries
};
