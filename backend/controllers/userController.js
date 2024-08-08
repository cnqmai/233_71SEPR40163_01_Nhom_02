const User = require('../models/User');
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const { formatDate, generateUserId } = require('../utils/functions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const getObjectIdFromCustomId = async (customId) => {
  const user = await User.findOne({ ID: customId });
  return user ? user._id : null;
};

// Theo dõi 
exports.followUser = async (req, res) => {
  const currentUserId = req.userId; // Custom ID from the authenticated token
  const targetUserId = req.params.userId; // Custom ID of the target user

  try {
    // Convert custom IDs to ObjectIds
    const currentUserObjectId = await getObjectIdFromCustomId(currentUserId);
    const targetUserObjectId = await getObjectIdFromCustomId(targetUserId);

    if (!currentUserObjectId || !targetUserObjectId) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current user is already following the target user
    const currentUser = await User.findById(currentUserObjectId);
    if (currentUser.DangTheoDoi.includes(targetUserObjectId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Check if target user already has the current user as a follower
    const targetUser = await User.findById(targetUserObjectId);
    if (targetUser.NguoiTheoDoi.includes(currentUserObjectId)) {
      return res.status(400).json({ message: 'User is already following you' });
    }

    // Add target user to the list of users the current user is following
    await User.findByIdAndUpdate(
      currentUserObjectId,
      { $addToSet: { DangTheoDoi: targetUserObjectId } },
      { new: true }
    );

    // Add current user to the list of followers of the target user
    await User.findByIdAndUpdate(
      targetUserObjectId,
      { $addToSet: { NguoiTheoDoi: currentUserObjectId } },
      { new: true }
    );

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Hủy theo dõi
exports.unfollowUser = async (req, res) => {
  const currentUserId = req.userId; // Custom ID from the authenticated token
  const targetUserId = req.params.userId; // Custom ID of the target user

  try {
    // Convert custom IDs to ObjectIds
    const currentUserObjectId = await getObjectIdFromCustomId(currentUserId);
    const targetUserObjectId = await getObjectIdFromCustomId(targetUserId);

    if (!currentUserObjectId || !targetUserObjectId) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find current user and target user
    const currentUser = await User.findById(currentUserObjectId);
    const targetUser = await User.findById(targetUserObjectId);

    // Check if the current user is following the target user
    if (!currentUser.DangTheoDoi.includes(targetUserObjectId)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    // Check if the target user has the current user as a follower
    if (!targetUser.NguoiTheoDoi.includes(currentUserObjectId)) {
      return res.status(400).json({ message: 'User is not following you' });
    }

    // Remove target user from the list of users the current user is following
    await User.findByIdAndUpdate(
      currentUserObjectId, // Find the current user by ObjectId
      { $pull: { DangTheoDoi: targetUserObjectId } }, // Remove targetUserObjectId from following list
      { new: true }
    );

    // Remove current user from the list of followers of the target user
    await User.findByIdAndUpdate(
      targetUserObjectId, // Find the target user by ObjectId
      { $pull: { NguoiTheoDoi: currentUserObjectId } }, // Remove currentUserObjectId from followers list
      { new: true }
    );

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy danh sách theo dõi
exports.getFollowInfoByID = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Tìm một người dùng duy nhất theo ID
    const user = await User.findOne({ ID: userId })
      .populate('NguoiTheoDoi', 'ID HoTen TenTaiKhoan AnhDaiDien NgayTao GioiThieu NguoiTheoDoi DangTheoDoi')
      .populate('DangTheoDoi', 'ID HoTen TenTaiKhoan AnhDaiDien NgayTao GioiThieu NguoiTheoDoi DangTheoDoi');

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }

    res.json({
      NguoiTheoDoi: user.NguoiTheoDoi,
      DangTheoDoi: user.DangTheoDoi
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tìm tài khoản đang đăng nhập
exports.getUser = async (req, res) => {
  try {
    console.log('req.userId:', req.userId); // Kiểm tra giá trị req.userId
    const user = await User.findOne({ ID: req.userId });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};

// Tìm tài khoản theo ID
exports.getUserByID = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ ID: id });
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error');
  }
};

// Cập nhật Trạng thái Đọc
exports.updateBookStatus = async (req, res) => {
  const { bookId, status } = req.body;
  const userId = req.userId; 
  if (!bookId || !status || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ID: userId});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Xóa bookId khỏi tất cả các danh sách trạng thái
    user.MuonDoc.pull(bookId);
    user.DangDoc.pull(bookId);
    user.DaDoc.pull(bookId);

    // Thêm bookId vào danh sách tương ứng với trạng thái mới
    switch (status) {
      case 'Muốn đọc':
        user.MuonDoc.push(bookId);
        break;
      case 'Đang đọc':
        user.DangDoc.push(bookId);
        break;
      case 'Đã đọc':
        user.DaDoc.push(bookId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid status' });
    }

    await user.save();

    res.status(200).json({ message: 'Book status updated successfully' });
  } catch (error) {
    console.error('Error updating book status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cập nhật hồ sơ
exports.updateProfileByUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload file error!' });
    }

    // Lấy userId từ URL và kiểm tra tính hợp lệ
    const { userId } = req.params;
    const { tenTaiKhoan, fullName, ngaySinh, gioiTinh, gioiThieu, thanhPho, soThich } = req.body;

    const updateData = {
      TenTaiKhoan: tenTaiKhoan,
      HoTen: fullName,
      NgaySinh: ngaySinh,
      GioiTinh: gioiTinh,
      GioiThieu: gioiThieu,
      ThanhPho: thanhPho,
      SoThich: soThich,
    };

    if (req.file) {
      updateData.AnhDaiDien = req.file.filename;
    }

    try {
      const updatedUser = await User.findOneAndUpdate({ ID: userId }, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('Updated user:', updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(400).json({ message: error.message });
    }
  });
};

// Lấy người dùng (có sách)
exports.getUserWithRef = async (req, res) => {
  const { userId } = req.params;
  try {
      const user = await User.findById(userId)
          .populate('MuonDoc')
          .populate('DangDoc')
          .populate('DaDoc');
      res.status(200).json(user);
  } catch (err) {
      res.status(500).send(err);
  }
};

// Tìm tài khoản theo tên
exports.getUsersByName = async (req, res) => {
    try {
      const userName = req.params.name;
      const user = await User.findOne({ TenTaiKhoan: userName });
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Server error');
    }
};

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ GiaTri: 1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy các sách vào hàng chờ đã xóa gần đây
exports.getAllUsersValueZero = async (req, res) => {
  try {
      const users = await User.find({ GiaTri: 0 });
      res.json(users);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Tìm kiếm tài khoản theo tên tài khoản / ID / họ tên
exports.searchUsers = async (req, res) => {
    const { query } = req.query; 
    try {
      const users = await User.find({
        $or: [
          { TenTaiKhoan: new RegExp(query, 'i') },
          { HoTen: new RegExp(query, 'i') },
          { ID: new RegExp(query, 'i') }
        ]
      }); 
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
};

// Cấu hình lưu trữ file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/public/images');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Cấu hình middleware Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
}).single('avatar');

// Tạo mới
exports.createUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload file error!' });
    }

    const { userName, password, fullName, email, birthDate, gender, introduction, region, hobbies } = req.body;

    
    const userId = await generateUserId();
    const newUser = new User({
      ID: userId,
      TenTaiKhoan: userName,
      MatKhau: password,
      HoTen: fullName,
      Email: email,
      NgaySinh: birthDate,
      NgayTao: formatDate(new Date()),
      GioiTinh: gender,
      GioiThieu: introduction,
      ThanhPho: region,
      SoThich: hobbies,
      AnhDaiDien: req.file ? req.file.filename : '',
      GiaTri: 1, 
    });
    
    try {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      console.error('Save user error:', error);
      res.status(400).json({ message: error.message });
    }
  });
};

// Sửa tài khoản trong Admin
exports.updateUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload file error!' });
    }

    const { userId, userName, fullName, email, birthDate, gender, introduction, region, hobbies } = req.body;

    const updateData = {
      TenTaiKhoan: userName,
      HoTen: fullName,
      Email: email,
      NgaySinh: birthDate,
      GioiTinh: gender,
      GioiThieu: introduction,
      ThanhPho: region,
      SoThich: hobbies,
    };

    if (req.file) {
      updateData.AnhDaiDien = req.file.filename;
    }

    try {
      const updatedUser = await User.findOneAndUpdate({ ID: userId }, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('Updated user:', updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(400).json({ message: error.message });
    }
  });
};

// Đổi trạng thái người dùng
exports.updateValue = async (req, res) => {
  const { id, giatri } = req.body;
  try {
    const result = await User.updateMany({ ID: id }, { $set: { GiaTri: giatri } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Đổi trạng thái tất cả người dùng
exports.updateAllValue = async (req, res) => {
  const { giatri } = req.body;
  try {
    const result = await User.updateMany({}, { $set: { GiaTri: giatri } }); 
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Xóa người dùng theo ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findOneAndDelete({ ID: id });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Xóa tất cả người dùng trong hàng chờ đã xóa gần đây
exports.deleteUsersWithValueZero = async (req, res) => {
  try {
    const deleteResult = await User.deleteMany({ GiaTri: 0 });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No users to delete' });
    }

    return res.status(200).json({ message: 'Users deleted successfully' });
  } catch (error) {
    console.error('Error deleting users with value 0:', error);
    return res.status(500).json({ message: 'Error deleting users with value 0', error: error.message });
  }
};


// Xóa tất cả người dùng
exports.deleteAllUsers = async (req, res) => {
  try {
    const deleteResult = await User.deleteMany();

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    return res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    return res.status(500).json({ message: 'Error deleting all users', error: error.message });
  }
};
