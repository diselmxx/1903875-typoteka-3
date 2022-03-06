"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Author extends Model {}

const define = (sequelize) =>
  Author.init(
      {
        email: {
          type: DataTypes.STRING,
          allowNull: false,
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
        avatar: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: `Author`,
        tableName: `authors`,
      }
  );

module.exports = define;
