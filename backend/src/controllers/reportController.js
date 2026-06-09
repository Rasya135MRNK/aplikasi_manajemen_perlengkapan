const { Item, Category, Transaction, Loan } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.stockReport = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order: [['stock', 'ASC']],
    });

    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.transactionReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    if (type) where.type = type;

    const transactions = await Transaction.findAll({
      where,
      include: [
        { model: Item, attributes: ['id', 'name', 'sku'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const summary = {
      totalCheckIn: transactions.filter(t => t.type === 'check_in').reduce((s, t) => s + t.quantity, 0),
      totalCheckOut: transactions.filter(t => t.type === 'check_out').reduce((s, t) => s + t.quantity, 0),
    };

    res.json({ transactions, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loanReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.loanDate = { [Op.between]: [startDate, endDate] };
    }
    if (status) where.status = status;

    const loans = await Loan.findAll({
      where,
      include: [
        { model: Item, attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const summary = {
      totalBorrowed: loans.filter(l => l.status === 'borrowed').length,
      totalReturned: loans.filter(l => l.status === 'returned').length,
      totalOverdue: loans.filter(l => l.status === 'overdue').length,
    };

    res.json({ loans, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
