const { Item, Loan, User, Notification } = require('../models');
const { sendMessage } = require('./waha');
const { Op } = require('sequelize');

async function checkLowStock() {
  try {
    const items = await Item.findAll({
      where: {
        stock: { [Op.lte]: require('sequelize').col('minStock') },
      },
    });

    const admins = await User.findAll({
      where: { role: ['super_admin', 'admin'], isActive: true },
    });

    for (const item of items) {
      const recentNotif = await Notification.findOne({
        where: {
          itemId: item.id,
          type: 'low_stock',
          createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });
      if (recentNotif) continue;

      const message = `*Peringatan Stok Menipis*\n\nBarang: ${item.name}\nStok Saat Ini: ${item.stock}\nStok Minimal: ${item.minStock}\n\nSegera lakukan pengadaan barang.`;

      for (const admin of admins) {
        if (!admin.phone) continue;
        const result = await sendMessage(admin.phone, message);

        await Notification.create({
          itemId: item.id,
          type: 'low_stock',
          message: `Stok ${item.name} menipis (${item.stock}/${item.minStock})`,
          recipient: admin.phone,
          status: result ? 'sent' : 'failed',
        });
      }
    }
  } catch (error) {
    console.error('Low stock check error:', error.message);
  }
}

async function checkOverdueLoans() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const loans = await Loan.findAll({
      where: {
        status: 'borrowed',
        dueDate: { [Op.lt]: today },
      },
      include: [{ model: Item, attributes: ['name'] }],
    });

    for (const loan of loans) {
      await loan.update({ status: 'overdue' });

      const message = `*Peringatan Peminjaman Terlambat*\n\nBarang: ${loan.Item.name}\nPeminjam: ${loan.borrowerName}\nJatuh Tempo: ${loan.dueDate}\n\nSegera hubungi peminjam untuk pengembalian.`;

      const admins = await User.findAll({
        where: { role: ['super_admin', 'admin'], isActive: true },
      });

      for (const admin of admins) {
        if (!admin.phone) continue;
        const result = await sendMessage(admin.phone, message);

        await Notification.create({
          itemId: loan.itemId,
          type: 'overdue_loan',
          message: `Peminjaman ${loan.Item.name} oleh ${loan.borrowerName} terlambat`,
          recipient: admin.phone,
          status: result ? 'sent' : 'failed',
        });
      }
    }
  } catch (error) {
    console.error('Overdue loan check error:', error.message);
  }
}

function startNotificationScheduler() {
  checkLowStock();
  checkOverdueLoans();

  setInterval(() => {
    checkLowStock();
    checkOverdueLoans();
  }, 30 * 60 * 1000);

  console.log('Notification scheduler started (30 minute interval)');
}

module.exports = {
  checkLowStock,
  checkOverdueLoans,
  startNotificationScheduler,
};
