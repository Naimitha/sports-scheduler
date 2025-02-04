
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'postgres',
  username: 'postgres',  // Change this to your PostgreSQL username
  password: 'Naimitha@123',  // Change this to your PostgreSQL password
  database: 'sports_scheduler',
  logging:false,
});

module.exports = sequelize;
