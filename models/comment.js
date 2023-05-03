'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      comment.belongsTo(models.user)
      comment.belongsTo(models.photo)

    }
  }
  comment.init({
    UserId: DataTypes.INTEGER,
    PhotoId: DataTypes.INTEGER,
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Comment is required!'
        },
      }
    }
  }, {
    sequelize,
    modelName: 'comment',
    freezeTableName: true

  });
  return comment;
};