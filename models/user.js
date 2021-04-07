'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require('sequelize');
import { constants } from '../core/constants';
const { userStatus, adminRoles } = constants;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(...Object.values(userStatus)),
      defaultValue: userStatus.init
    },
    deletedAt: DataTypes.DATE,
    lastLoginAt: DataTypes.DATE,
    role:{
      type : DataTypes.ENUM({
        values: [adminRoles.admin, adminRoles.staff, adminRoles.superAdmin]
      }),
      defaultValue: adminRoles.staff
    }
  }, {
    sequelize,
    modelName: 'Users',
    paranoid: true,
    deletedAt: 'deletedAt'
  });

  return User;
};
