const { Loan, Item } = require('../models');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;

    const { rows, count } = await Loan.findAndCountAll({
      where,
      include: [{ model: Item, attributes: ['id', 'name', 'sku'] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      loans: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [{ model: Item, attributes: ['id', 'name', 'sku'] }],
    });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json({ loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { itemId, borrowerName, borrowerPhone, quantity, loanDate, dueDate, notes } = req.body;

    if (!itemId || !borrowerName || !quantity || !loanDate || !dueDate) {
      return res.status(400).json({
        error: 'Item ID, borrower name, quantity, loan date, and due date are required',
      });
    }

    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const qty = parseInt(quantity);
    if (item.stock < qty) {
      return res.status(400).json({ error: `Insufficient stock. Available: ${item.stock}` });
    }

    const loan = await Loan.create({
      itemId,
      borrowerName,
      borrowerPhone,
      quantity: qty,
      loanDate,
      dueDate,
      notes,
      status: 'borrowed',
    });

    await item.decrement('stock', { by: qty });

    res.status(201).json({ loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.returnItem = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status === 'returned') {
      return res.status(400).json({ error: 'Item already returned' });
    }

    const returnDate = new Date().toISOString().split('T')[0];
    const newStatus = returnDate > loan.dueDate ? 'overdue' : 'returned';

    await loan.update({
      returnDate,
      status: newStatus,
    });

    const item = await Item.findByPk(loan.itemId);
    await item.increment('stock', { by: loan.quantity });

    res.json({ loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.overdue = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: {
        status: 'borrowed',
        dueDate: { [Op.lt]: new Date().toISOString().split('T')[0] },
      },
      include: [{ model: Item, attributes: ['id', 'name'] }],
    });

    res.json({ loans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
