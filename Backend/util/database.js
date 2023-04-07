const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense','root','nodecomplete', {
    dialect: 'mysql', 
    host: 'localhost'
})

module.exports = sequelize;