const router = require('express').Router();
const CartController = require('../controllers/CartController.js');
const { authenticate } = require('../middlewares/authenticate.js');
const { authorizeCart } = require('../middlewares/authorize.js');

router.post('/');
router.get('/');

router.patch('/:id');
router.delete('/:id');

module.exports = router;
