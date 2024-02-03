const { Router } = require('express');
const { userValidator } = require('../validators');
const { authMiddleware } = require('../middleware/auth');
const userController = require('../controllers/').userController;
const adminRoutes = require('./admin');

const router = Router();

router.get('/', (req, res) => res.send('Welcome'));

// user routes
// register
router.post('/register', userValidator.registerUserValidator, userController.registerUser);
// login
router.post('/login', userValidator.loginUserValidator, userController.loginUser);

// auth middleware
router.use(authMiddleware);

// admin routes
router.use('/admin/', adminRoutes);

module.exports = router;
