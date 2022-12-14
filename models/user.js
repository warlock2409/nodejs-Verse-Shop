const Sequelize = require('sequelize');

const sequelize = require('../util/datBase');

const user = sequelize.define('user',{
    id:{
        type:Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    email:Sequelize.DataTypes.STRING,
    password:Sequelize.DataTypes.STRING,
    name:Sequelize.DataTypes.STRING,
    phone:Sequelize.DataTypes.STRING,
    address:Sequelize.DataTypes.STRING
});
module.exports=user;