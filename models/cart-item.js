const Sequelize = require('sequelize');

const sequelize = require('../util/datBase');

const cartItem = sequelize.define('cartItem',{
  id:{
    type:Sequelize.DataTypes.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  qty:Sequelize.DataTypes.INTEGER
});
module.exports=cartItem;