'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class authToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  authToken.init({
    user: DataTypes.INTEGER,
    token: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'authToken',
  });
  return authToken;
};