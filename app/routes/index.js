const { Router } = require('express');
const { userValidator } = require('../validators');
const { authMiddleware } = require('../middleware/auth');
const userController = require('../controllers/').userController;

const router = Router();

router.get('/', (req, res) => res.send('Welcome'));

// user routes
router.post('/register', userValidator.registerUserValidator, userController.registerUser);
router.post('/login', userValidator.loginUserValidator, userController.loginUser);

router.use(authMiddleware);

router.get('/test-auth', (req, res) => res.send('You are authenticated'));

module.exports = router;
