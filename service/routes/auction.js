const router = require('express').Router();
const ProductController = require('../controllers/ProductController.js');
const { authenticate } = require('../middlewares/authenticate.js');

router.use(authenticate);

router.put('/:id', ProductController.editAuction);

module.exports = router;
