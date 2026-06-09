const sequelize = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Item = require('./Item');
const Transaction = require('./Transaction');
const Loan = require('./Loan');
const Notification = require('./Notification');

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Item, { foreignKey: 'categoryId' });
Item.belongsTo(Category, { foreignKey: 'categoryId' });

Item.hasMany(Transaction, { foreignKey: 'itemId' });
Transaction.belongsTo(Item, { foreignKey: 'itemId' });

Item.hasMany(Loan, { foreignKey: 'itemId' });
Loan.belongsTo(Item, { foreignKey: 'itemId' });

Item.hasMany(Notification, { foreignKey: 'itemId' });
Notification.belongsTo(Item, { foreignKey: 'itemId' });

module.exports = {
  sequelize,
  User,
  Category,
  Item,
  Transaction,
  Loan,
  Notification,
};
