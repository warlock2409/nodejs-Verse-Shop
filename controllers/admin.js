const Product = require('../models/product');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const User=require('../models/user');
const ShopKeeper= require('../models/shopkeeper');

exports.PostAdminLogin=(req,res,next)=>{
  const user=req.body.name;
  const password = req.body.password;
  ShopKeeper.findAll({where:{usercol:user}}).then(admin=>{
    console.log(admin[0].password);
    if(admin.length < 1){
     return res.redirect('/login');
    }
    if(password == admin[0].password){
      console.log("okay");
      req.session.isLoggedIn = true;
      return res.redirect("/admin/orderBook");
    }
   return admin
  }).then(admin=>{
     return res.redirect('/');
  }).catch(err => console.log(err));
}
exports.getAdminLogin=(req,res,next)=>{
  res.render('admin/log-in', { 
    path: '/AdminLogin',
    pageTitle: 'AdminLogIn',
    isAuthenticated: false
  });
}
exports.postStatus= (req,res,next)=>{
  const oId = req.body.orderId;
  Order.findAll({where:{id:oId}})
  .then(product=>{
    console.log(product[0]);
    product[0].status="Shipped";
    return product[0].save();
  }).then(result=>{
    console.log(result);
    res.redirect("/admin/orderBook");
  })
}
exports.getOrderBook=(req,res,next)=>{
  Order.findAll({ order: [
    ['id', 'DESC'],
    
],}).then(order =>{
    console.log(order);
    res.render('admin/orders', {
      prods:order,
      pageTitle: 'orderbook',
      path: '/admin/orderBook',
    });
  })
}

exports.getUserProductList=(req,res,next)=>{
  const oId=req.body.orderId;
  const uId = req.body.userId;
  var userinfo=0;
  console.log(oId);

  User.findByPk(uId).then(result=>{
  userinfo=result;
  console.log(userinfo);
  result.getOrders({include:['products']})
  .then(orders=>{
    res.render('admin/order-book', {
      info:userinfo,
      orders:orders,
      path: '/orderBook',
      pageTitle: 'All Orders',
      isAuthenticated: true
    });
  }).catch(err=>{
    console.log(err);
  })
})
}

exports.getOrderDelete=(req,res,next)=>{
  const oId=req.body.orderId;
  Order.findAll({where:{id:oId}}).then(order=>{
    console.log(order);
    return order[0].destroy();
  }).then(result=>{
    console.log(result);
    return res.redirect('/admin/orderBook');
  })
}






exports.getAddProduct = (req, res, next) => {
  const isLoggedIn =req.session.isLoggedIn;
  if(!isLoggedIn){
    return res.redirect('/login');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: isLoggedIn
  });
};
exports.getIndex = (req, res, next) => {
 
  const isLoggedIn = req.get('Cookie').split('=')[1];
  Product.findAll().then(products=>{
    res.render('shop/admin-index', {
          prods: products,
          pageTitle: 'adminShop',
          path: '/',
          isAuthenticated: req.session.isLoggedIn
        });
  }).catch(err =>console.log(err));
  // Product.fetchAll()
  // .then(([rows,field])=>{
  //   res.render('shop/index', {
  //     prods: rows,
  //     pageTitle: 'Shop',
  //     path: '/'
  //   });
  // }).catch(err=> console.log(err));
  
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const Qty = req.body.Qty;
  const description = req.body.description;
  req.user.createProduct({
       title:title,
    price:price,
    Qty:Qty,
    imgUrl:imageUrl,
    description:description
  })
  // Product.create({
  //   title:title,
  //   price:price,
  //   imgUrl:imageUrl,
  //   description:description,
  //   userId:req.user.id

  // })
  .then(result=>{
     console.log(result);
     res.redirect('/admin/products');
  }).catch(err => console.log(err));

  //sql
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save().then(()=>{

  //   res.redirect('/');
  // }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const isLoggedIn =req.session.isLoggedIn;
  if(!isLoggedIn){
    return res.redirect('/login');
  }
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findAll({where:{id:prodId}})
  // Product.findByPk(prodId)
  .then(products=>{
    const product=products[0];
    const isLoggedIn = req.get('Cookie').split('=')[1];
    res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
          isAuthenticated: req.session.isLoggedIn
        });
  }).catch(err => console.log(err));
  // Product.findById(prodId, product => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedQty = req.body.Qty;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId).then(product=>{
    product.title=updatedTitle;
    product.price=updatedPrice;
    product.Qty=updatedQty;
    product.imgUrl=updatedImageUrl;
    product.description=updatedDesc;
    return product.save();
  }).then(result=>{
    console.log(result);
    res.redirect('/admin/products');

  }).catch(err=>{
    console.log(err);
  })
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
};

exports.getProducts = (req, res, next) => {
 
  const isLoggedIn =req.session.isLoggedIn;
  if(!isLoggedIn){
    return res.redirect('/login');
  }
  console.log("user:********",req.user);
  // req.user.getProducts()
  Product.findAll()
  .then(products=>{
    console.log("user_Products:********",products);
    res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
          isAuthenticated:isLoggedIn
        });
  }).catch(err=> console.log(err));
  // sql
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product=>{
    return product.destroy();
  }).then(result=>{
    console.log("destroyed",result);
    res.redirect('/admin/products');
  }).catch(err =>{
    console.log(err);
  })
  // Product.deleteById(prodId);
};
