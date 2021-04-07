'use strict';
const adminRoles =  {
  superAdmin: 'SUPER_ADMIN',
    admin: 'ADMIN',
    staff: 'STAFF'
};
const userStatus = {
  init: 'INIT',
    verified: 'VERIFIED',
    inactive: 'INACTIVE',
    deleted: 'DELETED'
};
module.exports = {
  up: async (queryInterface, Sequelize) => {
     return queryInterface.createTable('User', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: Sequelize.STRING,
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM(...Object.values(userStatus)),
        defaultValue: userStatus.init
      },
      deletedAt: Sequelize.DATE,
      lastLoginAt: Sequelize.DATE,
      role:{
        type : Sequelize.ENUM(...Object.values(adminRoles)),
        defaultValue: adminRoles.staff
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
