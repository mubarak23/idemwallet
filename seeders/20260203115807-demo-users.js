'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      { id: uuidv4(), name: 'Alice', balance: 100000, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Bob', balance: 50000, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Charlie', balance: 75000, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
