const { User } = require('../models');

exports.index = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'username', 'phone', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot deactivate yourself' });
    }

    await user.update({ isActive: !user.isActive });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
