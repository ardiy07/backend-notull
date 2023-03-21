'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('colors', [
      {
        color: "#a8193d",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: "#4fcc25",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: "#1ebffa",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: "#8da377",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: "#9975bd",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: "#cf61a1",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: "#240959",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('colors', null, {});
  }
};
