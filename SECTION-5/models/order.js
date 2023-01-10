const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    unique: false,
  },
});

module.exports = Order;
