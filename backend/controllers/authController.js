const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { generateUserId } = require('../utils/functions');

// Đăng ký
exports.registerUser = async (req, res) => {
    try {
      const { TenTaiKhoan, HoTen, Email, MatKhau } = req.body;
  
      // Kiểm tra các trường hợp bắt buộc
      if (!TenTaiKhoan || !HoTen || !Email || !MatKhau) {
        return res.status(400).json({ message: 'Tất cả các trường bắt buộc phải được nhập' });
      }
  
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(MatKhau, 10);
      console.log('Mật khẩu ban đầu:', MatKhau);
      console.log('Mật khẩu đã mã hóa:', hashedPassword);
  
      // Tạo người dùng mới
      const ID = await generateUserId();
      const user = new User({
        TenTaiKhoan,
        HoTen,
        Email,
        MatKhau: hashedPassword,
        ID,
      });
  
      await user.save();
      res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Đăng nhập
  exports.loginUser = async (req, res) => {
    try {
      const { TenTaiKhoan, Email, MatKhau } = req.body;
  
      // Kiểm tra các trường hợp bắt buộc
      if ((!TenTaiKhoan && !Email) || !MatKhau) {
        return res.status(400).json({ message: 'Tên tài khoản hoặc Email và mật khẩu là bắt buộc' });
      }
  
      // Tìm người dùng bằng tên tài khoản hoặc email
      const user = await User.findOne({
        $or: [{ TenTaiKhoan }, { Email }]
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Tên tài khoản, Email hoặc mật khẩu không chính xác' });
      }
  
      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
      if (!isMatch) {
        return res.status(400).json({ message: 'Tên tài khoản, Email hoặc mật khẩu không chính xác' });
      }
  
      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.ID, TenTaiKhoan: user.TenTaiKhoan },
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '1h' }
      );
  
      // Đăng nhập thành công, gửi token và thông tin người dùng
      res.status(200).json({
        message: 'Đăng nhập thành công',
        token,
        userId: user.ID
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: error });
    }
  };
  
// Route để yêu cầu đặt lại mật khẩu
exports.forgotPass = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    // Tạo token đặt lại mật khẩu
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token có giá trị trong 1 giờ
    await user.save();

    // Gửi email với token
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.APP_PASSWORD
      }
    });

    const mailOptions = {
      to: user.Email,
      from: process.env.EMAIL_ADDRESS,
      subject: 'Đặt lại mật khẩu cho tài khoản Bookaboo',
      text: `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n\n` +
        `Vui lòng click vào link sau để hoàn tất quá trình đặt lại mật khẩu:\n\n` +
        `http://localhost:3001/matkhaumoi?token=${resetToken}\n\n` +
        `Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error sending email:', err); // Log chi tiết lỗi
        return res.status(500).json({ message: 'Có lỗi xảy ra khi gửi email' });
      }
      res.status(200).json({ message: 'Email đặt lại mật khẩu đã được gửi' });
    });
  } catch (error) {
    console.error('Error during password reset request:', error); // Log chi tiết lỗi
    res.status(500).json({ message: 'Server error' });
  }
};

// Đặt lại Mật khẩu
exports.resetPass = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Mã hóa mật khẩu trước khi lưu
    user.MatKhau = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    // Xóa token khỏi cơ sở dữ liệu
    await TokenModel.deleteOne({ token });
  }
  res.status(200).send('Logged out');
};