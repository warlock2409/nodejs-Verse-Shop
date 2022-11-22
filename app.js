const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
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
const authRoutes = require('./routes/auth');

const product = require('./models/product');
const { BelongsTo } = require('sequelize');
const user = require('./models/user');
const e = require('express');

const fileStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images');
  },
  filename :(req,file,cb)=>{
    cb(null, file.originalname);
  }
})
const fileFilters = (req,file,cb)=>{
  if(file.mimetype == 'image/png'|| file.mimetype =='image/jpg' || file.mimetype == 'image/jpeg'){
    cb(null,true);
  }else{
    cb(null, false);
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage,fileFilter:fileFilters}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));

app.use(session({secret:"my secret", resave:false,saveUninitialized:false}));
app.use((req, res, next) => {
 
  if (!req.session.user) {
    return next();
  }
  
  User.findByPk(req.session.user.id)

    .then(user => {
      req.user = user;
      console.log("app.js*****",req.session.user.id, req.user);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


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
then(cart=>{
    app.listen(3000);
})
.catch(err => console.log(err));
