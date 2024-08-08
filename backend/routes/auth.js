const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController');

//Route đăng ký
router.post('/register', authController.registerUser);

// Route đăng nhập
router.post('/login', authController.loginUser);

// Route quên mật khẩu
router.post('/forgotpassword', authController.forgotPass);

// Route đặt lại mật khẩu
router.post('/resetpassword/:token', authController.resetPass);

// Route đăng xuất
router.post('/logout', authController.logout);

module.exports = router;
