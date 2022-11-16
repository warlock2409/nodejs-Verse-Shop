const Sequelize = require('sequelize');

const sequelize = require('../util/datBase');

const order = sequelize.define('order',{
  id:{
    type:Sequelize.DataTypes.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  }
});
module.exports=order;