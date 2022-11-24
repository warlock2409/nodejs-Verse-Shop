const User = require('../models/user');
const Cart = require('../models/cart');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"hotmail",
  auth:{
    user:"verseshop@outlook.com",
    pass:"V&QqdB7pBqm4JzU"
  }
})
const bcrypt= require('bcryptjs');

exports.getLogin = (req, res, next) => {
  var err=null;
  if(req.session.flash){
    console.log("errorFlash",req.session.flash.email);
    err=req.session.flash.email;
  }
  req.session.flash={};
  console.log( req.session.isLoggedIn);
  res.render('auth/login', { 
    path: '/login',
    pageTitle: 'Login',
    errorRes:err
  });
};

exports.postSignUp = (req, res, next) => {
  const emailid = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const phone= req.body.Phone;
  const address= req.body.Address;
  let info = {
    from: 'verseshop@outlook.com', // sender address
    to: emailid,
    subject: "Welcome to Verse Shopping ", // Subject line
    text: "Your account created Sucessfully", // plain text body
    html: "<b>Your account created Sucessfully</b>", // html body
  }
  User.findAll({where:{email:emailid}})
  .then(result=>{
    if(result.length != 0){
      return res.redirect('/signup');
    }else{
    bcrypt.hash(password,6).then(ecpw =>{
     return User.create({email:emailid,password:ecpw,name:name,phone:phone,address:address});
    }).then(user=>{
        return user.createCart();
      }).then(result =>{
        console.log(result);
         res.redirect('/login');
          return transporter.sendMail(info, function(err,info){
          if(err){
            console.log(err);
            return;
          }
          console.log(info);
        })
      })
    }
  }).catch(err =>{
    console.log("signup error:" ,err);
    })
}

exports.postLogin = (req, res, next) => {
  const email=req.body.email;
  const password = req.body.password;
  User.findAll({where:{email:email}})
  .then(user => {
    if(user.length== 0){
      req.session.flash={email:"Invalid Email"};
      return res.redirect('/login');
    }
    return bcrypt.compare(password,user[0].password)
    .then(doMatch =>{
      if(doMatch){
        console.log(req.session);
        req.session.isLoggedIn = true;
        console.log(req.session);
        req.session.user = user[0];
       return req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      }
      req.session.flash={email:"Invalid Password"};
      return res.redirect('/login');
    })
    
  }).catch(err =>{
    console.log("login error:" , err);
  })
  };
  exports.postLogOut = (req, res, next) => {
    // res.setHeader('Set-Cookie',"LoggedIn=True");
    req.session.destroy(err=>{
      console.log("logout-Error:",err);
      res.redirect('/');
    });
  };