const Sequelize = require('sequelize');

const sequelize = require('../util/datBase');

const shopkeeper = sequelize.define('shopkeeper',{
    id:{
        type:Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    usercol:Sequelize.DataTypes.STRING,
    password:Sequelize.DataTypes.STRING,
    
});
module.exports=shopkeeper;