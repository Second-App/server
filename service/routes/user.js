const router = require('express').Router();
const UserController = require('../controllers/UserController.js');
const { authenticate } = require('../middlewares/authenticate.js');
const { authorizeUser } = require('../middlewares/authorize.js');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.use(authenticate);

router.use('/:id', authorizeUser);

router.get('/:id', UserController.getProfile);
router.put('/:id', UserController.editProfile);
router.patch('/:id', UserController.changePassword);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
