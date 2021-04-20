const { Chat } = require('../models');

class ChatController {
  static async createChat(req, res, next) {
    try {
      const { SenderId, ReceiverId, message } = req.body;

      const newChat = {
        SenderId,
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

  static async getChats(req, res, next) {
    try {
      const UserId = req.decoded.id;
      const { targetId } = req.query;

      if (targetId) {
        const sendChatData = await Chat.findAll({
          where: { SenderId: UserId, ReceiverId: targetId },
          include: ['User'],
        });

        const receiveChatData = await Chat.findAll({
          where: { ReceiverId: UserId, SenderId: targetId },
          include: ['User', 'User'],
        });

        res.status(200).json({
          send: sendChatData,
          receive: receiveChatData,
        });
      } else {
        const sendChatData = await Chat.findAll({
          where: { SenderId: UserId },
          include: ['User'],
        });

        const receiveChatData = await Chat.findAll({
          where: { ReceiverId: UserId },
          include: ['User', 'User'],
        });

        res.status(200).json({
          send: sendChatData,
          receive: receiveChatData,
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  // static async getChatReceive(req, res, next) {
  //   try {
  //     const UserId = req.decoded.id;

  //     const chatReceiveData = await Chat.findAll({
  //       where: { ReceiverId: UserId },
  //       include: ['User'],
  //     });

  //     if (!chatReceiveData) throw err;

  //     res.status(200).json(chatReceiveData);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

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
