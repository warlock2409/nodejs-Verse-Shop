const Sequelize = require('sequelize');

const sequelize = require('../util/datBase');

const user = sequelize.define('user',{
    id:{
        type:Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    userName:Sequelize.DataTypes.STRING,
    email:Sequelize.DataTypes.STRING
});
module.exports=user;