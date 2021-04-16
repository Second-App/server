const { VirtualAccount } = require('../models');

class VirtualAccountController {
  static async updateVA(req, res, next) {
    try {
      const { nominal } = req.body;

      const virtualAccountBalance = await VirtualAccount.findByPk(1);

      if (!virtualAccountBalance) throw err;

      const newBalance = virtualAccountBalance.balance + nominal;

      const newBalanceData = await VirtualAccount.update(
        { balance: newBalance },
        {
          where: { id: 1 },
        }
      );

      if (!newBalanceData) throw err;

      res.status(200).json({
        balance: newBalance,
      });
    } catch (error) {
      next(err);
    }
  }
}

module.exports = VirtualAccountController;
