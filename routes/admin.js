const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/Adminlogin',adminController.PostAdminLogin);

router.get('/Adminlogin',adminController.getAdminLogin);
router.get('/orderBook', adminController.getOrderBook);
router.post('/uplDelete',adminController.getOrderDelete);
router.post('/upl',adminController.getUserProductList);
router.post('/transport',adminController.postStatus);
// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
