const { Category, Item } = require('../models');

exports.index = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      include: [{ model: Item, attributes: [] }],
      attributes: {
        include: [
          [require('sequelize').fn('COUNT', require('sequelize').col('Items.id')), 'itemCount'],
        ],
      },
      group: ['Category.id'],
    });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const category = await Category.create({ name, description });
    res.status(201).json({ category });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const { name, description } = req.body;
    await category.update({ name, description });
    res.json({ category });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const itemCount = await Item.count({ where: { categoryId: req.params.id } });
    if (itemCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category: ${itemCount} item(s) are using it`,
      });
    }

    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
