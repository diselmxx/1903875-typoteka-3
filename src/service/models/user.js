"use strict";

const {DataTypes, ENUM, Model} = require(`sequelize`);
const {Roles} = require(`../../constants`);

class User extends Model {}
const define = (sequelize) =>
  User.init(
      {
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        firstname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        role: {
          type: ENUM,
          values: Roles,
          defaultValue: Roles[2],
        },
      },
      {
        sequelize,
        modelName: `User`,
        tableName: `users`,
      }
  );

module.exports = define;
