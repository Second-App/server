'use strict';

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
    await queryInterface.bulkInsert(
      'Categories',
      [
        {
          id: 1,
          name: 'Automotive',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/1.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Property',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/2.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Foods & Beverages',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/3.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'Electronic & Gadgets',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/4.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: 'Hobbies & Sports',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/5.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: 'Household Needs',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/6.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: 'Self-Care',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/7.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: 'Kids',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/8.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: 'Office Needs',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/9.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          name: 'Pets',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/categories/10.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
