const Sequelize = require('sequelize');

const sequelize = require('../util/datBase');

const order = sequelize.define('order',{
  id:{
    type:Sequelize.DataTypes.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  status:{
    type:Sequelize.DataTypes.STRING
  }
});
module.exports=order;