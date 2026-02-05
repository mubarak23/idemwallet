'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TransactionLogs', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      idempotencyKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Prevents double processing on retries / double taps',
      },

      fromUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'Sender (can represent system account)',
      },

      toUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'Recipient',
      },

      amount: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: 'Stored in minor units (kobo, cents, sats)',
      },

      status: {
        type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('TransactionLogs', ['idempotencyKey']);
    await queryInterface.addIndex('TransactionLogs', ['fromUserId']);
    await queryInterface.addIndex('TransactionLogs', ['toUserId']);
    await queryInterface.addIndex('TransactionLogs', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('TransactionLogs');
  },
};
