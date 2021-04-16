const router = require('express').Router();
const VirtualAccountController = require('../controllers/VirtualAccountController.js');

router.patch('/', VirtualAccountController.updateVA);

module.exports = router;
