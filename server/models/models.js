const sequelize = require('../db');
const {
    DataTypes
} = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
});


const Bank = sequelize.define('bank', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    money: {
        type: DataTypes.INTEGER,
    },
});



User.hasOne(Bank);
Bank.belongsTo(User);

module.exports = {
    User,
    Bank
}