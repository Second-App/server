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
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/1.+automotive/1.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Property',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/2.+property/1.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Foods & Beverages',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/3.+food+%26+beverages/9.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'Electronic & Gadgets',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/4.+Electronic+%26+Gadgets/5.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: 'Hobbies & Sports',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/5.+Hobbies+%26+Sports/1.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: 'Household Needs',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/6.+Household+Needs/1.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: 'Self-Care',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/7.+Self-care/1.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: 'Kids',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/8.+Kids/1.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: 'Office Needs',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/9.+Office+Needs/1.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          name: 'Pets',
          imageURL:
            'https://secondh8.s3-ap-southeast-1.amazonaws.com/products/10.+Pets/1.jpeg',
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
