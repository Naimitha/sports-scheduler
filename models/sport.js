// models/sport.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sport = sequelize.define('Sport', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
});

module.exports = Sport;
