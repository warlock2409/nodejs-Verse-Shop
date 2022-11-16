// const mysql = require("mysql2");
const Sequelize = require('sequelize');

// const pool = mysql.createPool({
//     host:"localhost",
//     user:'rajaraman',
//     database:'node',
//     password:'Sql@2022'
// });

const sequelize = new Sequelize("node","rajaraman","Sql@2022",{dialect:'mysql', host:'localhost'});
async function myFunction() {
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
myFunction();
module.exports=sequelize;