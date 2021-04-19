const { Chat } = require('../models');

class ChatController {
  static async createChat(req, res, next) {
    try {
      const UserId = req.decoded.id;
      const { ReceiverId, message } = req.body;

      const newChat = {
        SenderId: UserId,
        ReceiverId,
        message,
      };

      const newChatData = await Chat.create(newChat);

      if (!newChatData) throw err;

      res.status(201).json(newChatData);
    } catch (err) {
      next(err);
    }
  }

  static async getChatsSend(req, res, next) {
    try {
      const chatSendData = await Chat.findAll();

      chatSendData.forEach((chat) => {});

      if (!chatSendData) throw err;

      res.status(200).json(chatSendData);
    } catch (err) {
      next(err);
    }
  }

  static async getChatReceive(req, res, next) {
    try {
      const UserId = req.decoded.id;

      const chatReceiveData = await Chat.findAll({
        where: { ReceiverId: UserId },
        include: ['User'],
      });

      if (!chatReceiveData) throw err;

      res.status(200).json(chatReceiveData);
    } catch (err) {
      next(err);
    }
  }

  static async deleteChat(req, res, next) {
    try {
      const { id } = req.params;

      const deleteChatData = await Chat.destroy({
        where: { id },
      });

      if (!deleteChatData) throw err;

      res.status(200).json({
        msg: 'data deleted',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ChatController;
