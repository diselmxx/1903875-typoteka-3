"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) =>
  Article.init(
      {
        title: {
        // eslint-disable-next-line new-cap
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        announce: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        fullText: {
        // should be full_text
          type: DataTypes.TEXT,
          allowNull: false,
        },
        picture: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: `Article`,
        tableName: `articles`,
      }
  );

module.exports = define;
