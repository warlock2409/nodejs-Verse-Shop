const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
//db
const sequelize = require('./util/datBase');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartIten = require('./models/cart-item');
const Order=require('./models/order');
const OrderItem=require('./models/order-item');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const product = require('./models/product');
const { BelongsTo } = require('sequelize');
const user = require('./models/user');

app.use((req,res,next)=>{
  User.findByPk(1).then(user => {
    req.user=user;
    next();
  }).catch(err => {
    console.log(err);
  })  
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartIten });
// Product.belongsToMany(Cart, { through: CartIten });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartIten });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


sequelize.
// sync({force:true}).
sync().
then(result=>{
    return User.findByPk(1);
}).then(user=>{
    if(!user){
        return User.create({userName:"ram",email:"123@gmail.com"});
    }
    return user;
}).then(user =>{
    // console.log(user);
    // return user.createOrder();
    return user.createCart();
    
})
// .then(result=>{
//   return User.findOne({where:{id:1}});
// }).then(data=>{
//   return data.getCart();
// })
.then(cart=>{
    console.log(cart.toJSON());
    
    app.listen(3000);
})
.catch(err => console.log(err));
