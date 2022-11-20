const Product = require('../models/product');
const Cart = require('../models/cart');
const { where } = require('sequelize');
const product = require('../models/product');
const { render } = require('pug');

exports.getProducts = (req, res, next) => {
  console.log("sessiom:" ,req.session);
  Product.findAll().then(products=>{
    const isLoggedIn =req.session.isLoggedIn;
    res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
          path: '/products',
          isAuthenticated: isLoggedIn
        });
  }).catch(err =>console.log(err));
};

exports.getProduct = (req, res, next) => { 
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product=>{
    const isLoggedIn =req.session.isLoggedIn;
    res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products',
          isAuthenticated: isLoggedIn
        });
  }).catch(err =>{
    console.log(err);
  })
  // Product.findById(prodId).then(([product])=>{
  //   console.log(product);
  //   res.render('shop/product-detail', {
  //     product: product[0],
  //     pageTitle: product.title,
  //     path: '/products'
  //   });
  // }).catch(err => console.log(err));
  
};

exports.getIndex = (req, res, next) => {
  
  const isLoggedIn =req.session.isLoggedIn;
  console.log(isLoggedIn);
  Product.findAll().then(products=>{
    res.render('shop/index', {
          prods: products, 
          pageTitle: 'Shop',
          path: '/',
          isAuthenticated: isLoggedIn
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

exports.getCart = (req, res, next) => {

 console.log("getCart",req);

  req.user.getCart()
  // Cart.findAll()
  .then(cart=>{
    console.log("user get cart***",cart);
    cart.getProducts().then( product=>{
      console.log("user get product***",product);
     
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: product,
        isAuthenticated: req.session.isLoggedIn
      });
    }
    )
   
  }).catch(err=>{
    console.log(err);
  })
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetcart;
  let prodQty=1;
  console.log("user:********",req.user);
  req.user
  .getCart()
  .then(cart=>{
    console.log("cart:",cart);
    fetcart=cart;
    return cart.getProducts({where:{id:prodId}});
  })
  .then(product =>{
    // console.warn("product:****",product);
    let item=product[0];
    if(item){
      // console.log("items:****",item);
      prodQty+=item.cartItem.qty;
      return item;
    }
    return Product.findByPk(prodId);

  }).then(productData=>{
    // console.log("update:***",productData);
    return fetcart.addProduct(productData,{through:{qty:prodQty}});
  })
  .then(render=>{

    res.redirect('/cart');
  })
  .catch(err=> console.log(err));
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:prodId}});
  })
  .then(product=>{
      let prod=product[0];
      return prod.cartItem.destroy();
  }).then(render=>{
    res.redirect('/cart');
  })
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
 
  // });
};

exports.getOrders = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  req.user.getOrders({include:['products']})
  .then(orders=>{
    // console.log("*****",orders);
    res.render('shop/orders', {
      orders:orders,
      path: '/orders',
      pageTitle: 'Your Orders',
      isAuthenticated: isLoggedIn
    });
  }).catch(err => console.log(err));
 
};
exports.placeOrder=(req,res,next)=>{
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => { 
      fetchedCart = cart;
      // console.log(fetchedCart);
      return cart.getProducts();
      
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { qty: product.cartItem.qty };
             
              Product.findByPk(product.id).then(p =>{
                
                p.Qty-=product.cartItem.qty ;
                return p.save();
              }).then(result=>{
                console.log(result);
              })
             
                return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));

}
exports.getCheckout = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: isLoggedIn
  });
};
