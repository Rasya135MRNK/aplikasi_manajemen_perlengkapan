const { Item, Loan, Transaction, Notification } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.summary = async (req, res) => {
  try {
    const totalItems = await Item.count();
    const lowStockItems = await Item.count({
      where: {
        stock: { [Op.lte]: col('minStock') },
      },
    });
    const activeLoans = await Loan.count({
      where: { status: 'borrowed' },
    });
    const unreadNotifications = await Notification.count({
      where: { isRead: false },
    });

    const recentTransactions = await Transaction.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Item, attributes: ['id', 'name'] },
      ],
    });

    const recentLoans = await Loan.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Item, attributes: ['id', 'name'] },
      ],
    });

    res.json({
      summary: {
        totalItems,
        lowStockItems,
        activeLoans,
        unreadNotifications,
      },
      recentTransactions,
      recentLoans,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
