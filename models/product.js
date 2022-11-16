const { Model } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = require('../util/datBase');

const product = sequelize.define('product',{
  id:{
    type:Sequelize.DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey: true,
    allowNull:false

  },
  title:Sequelize.DataTypes.STRING,
  price:{
    type:Sequelize.DataTypes.INTEGER,
    allowNull:false
  },
  Qty:{
    type:Sequelize.DataTypes.INTEGER
  },
  catogory:{
    type:Sequelize.DataTypes.INTEGER
  },
  imgUrl:{
    type:Sequelize.DataTypes.STRING,
    allowNull:false
  },
  description:{
    type:Sequelize.DataTypes.STRING,
    allowNull:false
  }
});

module.exports=product;












//sql
// const db = require('../util/datBase');
// const Cart = require('./cart');

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save(){
//   return db.execute('INSERT INTO PRODUCTS (productName,price,description,imgUrl) VALUE(?,?,?,?)',
//     [this.title,this.price,this.description,this.imageUrl]
//   );
//  }

//   static deleteById(id) {
   
//   }

//   static fetchAll() {
//     console.log(db.execute('SELECT * FROM products'));
//    return db.execute('SELECT * FROM products');
//   }

//   static findById(id) {
//    return db.execute('SELECT * FROM products WHERE id = ? ',[id]);
//   }
// };
