const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 },
  },
  minStock: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 0 },
  },
  unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'pcs',
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});

module.exports = Item;
