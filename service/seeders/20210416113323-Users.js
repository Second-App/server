'use strict';

const { hashPass } = require('../helpers/bcrypt.js');

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
      'Users',
      [
        {
          name: 'Nyoman Adi',
          email: 'nyoman.adi16@gmail.com',
          password: hashPass('Testing123'),
          imageUrl:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          balance: 0,
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta',
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
    await queryInterface.bulkDelete('Users', null, {});
  },
};
