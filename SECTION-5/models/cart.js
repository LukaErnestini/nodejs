const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define("cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    unique: true,
  },
});

module.exports = Cart;
