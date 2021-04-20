/** @format */

const router = require('express').Router();
const CommunityController = require('../controllers/CommunityController.js');
const ProductController = require('../controllers/ProductController.js');
const { authenticate } = require('../middlewares/authenticate.js');
const { authorizeCommunity } = require('../middlewares/authorize.js');

router.use(authenticate);

router.post('/', CommunityController.createCard);
router.get('/', CommunityController.getCommunity);

router.use('/:id', authorizeCommunity);

router.delete('/:id', CommunityController.deleteCommunity);

router.patch('/', ProductController.changeOwner);

module.exports = router;
