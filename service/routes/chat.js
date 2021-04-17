const router = require('express').Router();
const ChatController = require('../controllers/ChatController.js');
const { authenticate } = require('../middlewares/authenticate.js');
const { authorizeChat } = require('../middlewares/authorize.js');

router.use(authenticate);

router.post('/', ChatController.createChat);

router.get('/send', ChatController.getChatsSend);
router.get('/receive', ChatController.getChatReceive);

router.use('/:id', authorizeChat);

router.delete('/:id', ChatController.deleteChat);

module.exports = router;
