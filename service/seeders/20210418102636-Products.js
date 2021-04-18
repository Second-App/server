'use strict';
const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let productsData = JSON.parse(
      fs.readFileSync('./data/product.json', 'utf-8')
    );

    productsData.forEach((product) => {
      (product.createdAt = new Date()), (product.updatedAt = new Date());
    });

    return queryInterface.bulkInsert('Products', productsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Products', null, {});
  },
};
