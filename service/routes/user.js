const router = require('express').Router();
const UserController = require('../controllers/UserController.js');
const { authenticate } = require('../middlewares/authenticate.js');
const { authorizeUser } = require('../middlewares/authorize.js');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.patch('/topup/:id', UserController.updateBalance);

router.use(authenticate);

router.get('/:id', authorizeUser, UserController.getProfile);
router.put('/:id', authorizeUser, UserController.editProfile);
router.patch('/password/:id', authorizeUser, UserController.changePassword);
router.delete('/:id', authorizeUser, UserController.deleteUser);

module.exports = router;
