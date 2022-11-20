const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup',(req, res, next) => {
    res.render('auth/signup', { 
        path: '/signup',
        pageTitle: 'signup',
        isAuthenticated: false
      });
});


router.post('/signup',authController.postSignUp);

router.post('/login', authController.postLogin);

router.post('/logOut',authController.postLogOut);

module.exports = router;