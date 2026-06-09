const { Transaction, Item } = require('../models');
const { Op } = require('sequelize');

exports.checkin = async (req, res) => {
  try {
    const { itemId, quantity, notes } = req.body;
    if (!itemId || !quantity) {
      return res.status(400).json({ error: 'Item ID and quantity are required' });
    }

    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const transaction = await Transaction.create({
      itemId,
      type: 'check_in',
      quantity: parseInt(quantity),
      userId: req.user.id,
      notes,
    });

    await item.increment('stock', { by: parseInt(quantity) });

    res.status(201).json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { itemId, quantity, notes } = req.body;
    if (!itemId || !quantity) {
      return res.status(400).json({ error: 'Item ID and quantity are required' });
    }

    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const qty = parseInt(quantity);
    if (item.stock < qty) {
      return res.status(400).json({ error: `Insufficient stock. Available: ${item.stock}` });
    }

    const transaction = await Transaction.create({
      itemId,
      type: 'check_out',
      quantity: qty,
      userId: req.user.id,
      notes,
    });

    await item.decrement('stock', { by: qty });

    res.status(201).json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.index = async (req, res) => {
  try {
    const { itemId, type, startDate, endDate, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (itemId) where.itemId = parseInt(itemId);
    if (type) where.type = type;
    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const { rows, count } = await Transaction.findAndCountAll({
      where,
      include: [
        { model: Item, attributes: ['id', 'name', 'sku'] },
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      transactions: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
