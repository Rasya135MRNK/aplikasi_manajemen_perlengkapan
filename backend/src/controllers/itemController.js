const { Item, Category } = require('../models');
const fs = require('fs');
const path = require('path');

exports.index = async (req, res) => {
  try {
    const { search, categoryId, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.name = { [require('sequelize').Op.like]: `%${search}%` };
    }
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const { rows, count } = await Item.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      items: rows,
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
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'name'] }],
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, sku, categoryId, description, stock, minStock, unit } = req.body;
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Item image is required' });
    }

    const item = await Item.create({
      name,
      sku,
      categoryId: parseInt(categoryId),
      description,
      stock: stock || 0,
      minStock: minStock || 5,
      unit: unit || 'pcs',
      image: 'uploads/items/' + req.file.filename,
    });

    res.status(201).json({ item });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const { name, sku, categoryId, description, stock, minStock, unit } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (sku !== undefined) updateData.sku = sku;
    if (categoryId) updateData.categoryId = parseInt(categoryId);
    if (description !== undefined) updateData.description = description;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (minStock !== undefined) updateData.minStock = parseInt(minStock);
    if (unit) updateData.unit = unit;

    if (req.file) {
      if (item.image) {
        const oldPath = path.join(__dirname, '..', '..', item.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = 'uploads/items/' + req.file.filename;
    }

    await item.update(updateData);
    res.json({ item });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.image) {
      const imagePath = path.join(__dirname, '..', '..', item.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
