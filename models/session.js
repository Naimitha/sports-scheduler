// models/session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  sportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sports',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  additionalPlayers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'completed'),
    defaultValue: 'active',
  }
});

module.exports = Session;
