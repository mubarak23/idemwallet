'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LedgerEntries', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      transactionId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'User ID or system account ID',
      },

      entryType: {
        type: Sequelize.ENUM('DEBIT', 'CREDIT'),
        allowNull: false,
      },

      amount: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: 'Stored in minor units (kobo, cents, sats)',
      },

      status: {
        type: Sequelize.ENUM('PENDING', 'POSTED', 'REVERSED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },

      referenceType: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'TRANSFER | DISBURSEMENT | INTEREST | REVERSAL',
      },

      referenceId: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'ID of the entity this ledger entry refers to',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('LedgerEntries', ['transactionId']);
    await queryInterface.addIndex('LedgerEntries', ['accountId']);
    await queryInterface.addIndex('LedgerEntries', ['referenceType', 'referenceId']);
    await queryInterface.addIndex('LedgerEntries', ['status']);
  },

  

  async down(queryInterface) {
    await queryInterface.dropTable('LedgerEntries');
  },
};
