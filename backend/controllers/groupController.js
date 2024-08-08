const Group = require('../models/Group');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment')
const { generateGroupId } = require('../utils/functions');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { emit } = require('process');

// Tham gia nhóm
exports.joinGroup = async (req, res) => {
  const userId = req.userId; // Lấy ID người dùng từ token, kiểu String
  const { groupId } = req.body; // ID nhóm từ yêu cầu, kiểu String

  try {
    // Kiểm tra xem nhóm có tồn tại không
    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const user = await User.findOne({ID: userId});
    if (!user) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Cập nhật thông tin người dùng
    await User.findOneAndUpdate({ ID: userId }, {
      $addToSet: { NhomThamGia: groupId } // Thêm nhóm vào danh sách nhóm tham gia của người dùng
    });

    // Cập nhật thông tin nhóm (nếu cần, ví dụ thêm người dùng vào danh sách thành viên nhóm)
    await Group.findOneAndUpdate({ _id: groupId }, {
      $addToSet: { ThanhVien: user._id } // Thêm người dùng vào danh sách thành viên nhóm
    });

    res.status(200).json({ message: 'Joined the group successfully' });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Rời nhóm
exports.leaveGroup = async (req, res) => {
  const userId = req.userId;
  const { groupId } = req.body;

  try {
    // Kiểm tra xem nhóm có tồn tại không
    const group = await Group.findOne({ _id: groupId }).populate('QuanTriVien');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ ID: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra số lượng quản trị viên
    const isOnlyAdmin = group.QuanTriVien.length <= 1 && group.QuanTriVien.some(admin => admin._id.toString() === user._id.toString());

    // Nếu người dùng là quản trị viên của nhóm và là quản trị viên duy nhất
    if (user.NhomQuanTri.includes(groupId) && isOnlyAdmin) {
      return res.status(400).json({ message: 'Cannot leave the group as the only administrator' });
    }

    // Cập nhật thông tin người dùng để loại bỏ nhóm khỏi NhomThamGia
    await User.findOneAndUpdate(
      { ID: userId },
      { $pull: { NhomThamGia: groupId } }
    );

    // Cập nhật thông tin nhóm
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId },
      { $pull: { ThanhVien: user._id } },
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    // Nếu người dùng là quản trị viên của nhóm
    if (user.NhomQuanTri.includes(groupId)) {
      // Remove the group from the user's NhomQuanTri
      await User.findOneAndUpdate({ ID: userId }, {
        $pull: { NhomQuanTri: groupId }
      });

      // Remove the user from the group's QuanTriVien
      await Group.findOneAndUpdate({ _id: groupId }, {
        $pull: { QuanTriVien: user._id }
      });
    }

    res.status(200).json({ message: 'Left the group successfully' });
  } catch (error) {
    console.error('Error leaving group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy nhóm có danh sách user
exports.getGroupWithUsers = async (req, res) => {
    try {
      const { userId, groupName } = req.params;
      const decodedName = decodeURIComponent(groupName); // Giải mã tên nhóm từ URL

      const group = await Group.findOne({ TenNhom: decodedName })
        .populate('ThanhVien') // Populate members
        .populate('QuanTriVien') // Populate admin
        .exec();
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      // Return group data along with the users in the group and admin
      res.json({
        group,
        users: group.ThanhVien, // Users are populated from the group document
        admins: group.QuanTriVien // Admin is populated from the group document
      });
    } catch (error) {
      console.error('Error fetching group with users and admin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

// Lấy nhóm có bài đăng
exports.getGroupWithPosts = async (req, res) => {
  try {
    const { userId, groupName } = req.params;
    const decodedName = decodeURIComponent(groupName); // Giải mã tên nhóm từ URL

    const group = await Group.findOne({ TenNhom: decodedName })
      .populate({
        path: 'BaiDang',
        populate: [
          { path: 'userId', select: 'TenTaiKhoan AnhDaiDien' },
          {
            path: 'BinhLuan',
            populate: { path: 'userId', select: 'TenTaiKhoan AnhDaiDien' },
            select: 'NoiDung NgayBL userId'
          }
        ]
      })
      .populate('ThanhVien', 'TenTaiKhoan AnhDaiDien')  
      .populate('QuanTriVien', 'TenTaiKhoan AnhDaiDien'); 

    if (!group) {
      return res.status(404).json({ message: 'Nhóm không tồn tại' });
    }

    // Sắp xếp bài đăng từ mới nhất đến cũ nhất
    group.BaiDang.sort((a, b) => new Date(b.ThoiGian) - new Date(a.ThoiGian));

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy NHIỀU nhóm có bài đăng
exports.getGroupsWithPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm user bằng userId để lấy NhomThamGia
    const user = await User.findOne({ ID: userId });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Lấy danh sách các nhóm mà user tham gia
    const groups = await Group.find({ _id: { $in: user.NhomThamGia } })
      .populate({
        path: 'BaiDang',
        populate: [
          { path: 'userId', select: 'TenTaiKhoan AnhDaiDien' },
          {
            path: 'BinhLuan',
            populate: { path: 'userId', select: 'TenTaiKhoan AnhDaiDien' },
            select: 'NoiDung NgayBL userId'
          }
        ]
      })
      .populate('ThanhVien', 'TenTaiKhoan AnhDaiDien')  
      .populate('QuanTriVien', 'TenTaiKhoan AnhDaiDien');

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm nào' });
    }

    // Sắp xếp các bài đăng theo ThoiGian trong mỗi nhóm
    groups.forEach(group => {
      group.BaiDang.sort((a, b) => new Date(b.ThoiGian) - new Date(a.ThoiGian));
    });

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy nhóm mà người dùng chưa tham gia
exports.getSuggestGroups = async (req, res) => {
  try {
    const { userId, groupName } = req.params;
    const decodedUserId = decodeURIComponent(userId); // Giải mã userId từ URL

    // Tìm người dùng theo userId
    const user = await User.findOne({ ID: decodedUserId });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Lấy tất cả các nhóm trong cơ sở dữ liệu
    const allGroups = await Group.find();

    // Lọc ra các nhóm mà người dùng chưa tham gia
    const suggestGroups = allGroups.filter(group => 
      !user.NhomQuanTri.includes(group._id) && 
      !group.ThanhVien.includes(user._id)
    );

    res.json(suggestGroups);
  } catch (error) {
    console.error('Lỗi khi lấy nhóm chưa tham gia:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy nhóm do người dùng quản lý
exports.getManageGroups = async (req, res) => {
  try {
    const { userId, groupName } = req.params;
    const decodedUserId = decodeURIComponent(userId); // Giải mã userId từ URL

    // Tìm người dùng theo userId
    const user = await User.findOne({ ID: decodedUserId });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Lấy danh sách các nhóm do người dùng quản lý
    const groups = await Group.find({ _id: { $in: user.NhomQuanTri } })
      .populate({
        path: 'BaiDang',
        populate: { path: 'userId', select: 'TenTaiKhoan AnhDaiDien' }
      })
      .populate('ThanhVien', 'TenTaiKhoan AnhDaiDien')
      .populate('QuanTriVien', 'TenTaiKhoan AnhDaiDien');
      
    res.json(groups);
  } catch (error) {
    console.error('Lỗi khi lấy nhóm do người dùng quản lý:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy nhóm người dùng tham gia
exports.getJoinedGroups = async (req, res) => {
  try {
    const { userId, groupName } = req.params;
    const decodedUserId = decodeURIComponent(userId); // Giải mã userId từ URL

    // Tìm người dùng theo userId
    const user = await User.findOne({ ID: decodedUserId });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Lấy danh sách các nhóm người dùng tham gia và populate các đối tượng liên kết
    const groups = await Group.find({ _id: { $in: user.NhomThamGia } })
      .populate({
        path: 'BaiDang',
        populate: { path: 'userId', select: 'TenTaiKhoan AnhDaiDien' }
      })
      .populate('ThanhVien', 'TenTaiKhoan AnhDaiDien')
      .populate('QuanTriVien', 'TenTaiKhoan AnhDaiDien');

    res.json(groups);
  } catch (error) {
    console.error('Lỗi khi lấy nhóm người dùng tham gia:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// Lấy tất cả nhóm
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({ GiaTri: 1 })
    .populate('QuanTriVien')
    .populate('BaiDang')
    .populate('ThanhVien');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy các sách vào hàng chờ đã xóa gần đây
exports.getAllGroupsValueZero = async (req, res) => {
  try {
      const groups = await Group.find({ GiaTri: 0 })
      .populate('QuanTriVien')
      .populate('BaiDang')
      .populate('ThanhVien');
      res.json(groups);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Tìm kiếm nhóm theo tên hoặc ID
exports.searchGroups = async (req, res) => {
  const { query } = req.query; 
  try {
    const groups = await Group.find({
      $or: [
        { TenNhom: new RegExp(query, 'i') },
        { ID: new RegExp(query, 'i') }
      ]
    })
    .populate('QuanTriVien')
    .populate('BaiDang')
    .populate('ThanhVien'); 
    res.json(groups);
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
}).single('coverImage');

// Middleware xử lý yêu cầu POST tạo nhóm mới
exports.createGroup = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload file error!' });
    }

    const userId = req.userId;  
    const { groupName, description } = req.body;

    try {
      const user = await User.findOne({ ID: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const groupId = await generateGroupId();

      const newGroup = new Group({
        ID: groupId,
        TenNhom: groupName,
        GioiThieu: description,
        AnhDaiDien: req.file ? req.file.filename : '/DefaultGroup.png',
        QuanTriVien: [user._id], 
        ThanhVien: [user._id] 
      });

      const savedGroup = await newGroup.save();     
      
      // Cập nhật User với nhóm mới
      user.NhomQuanTri.push(savedGroup._id);
      user.NhomThamGia.push(savedGroup._id);
      await user.save();

      res.status(200).json(savedGroup);
    } catch (error) {
      console.error('Save group error:', error);
      res.status(400).json({ message: error.message });
    }
  });
};


// Người dùng tạo nhóm
exports.createGroupByUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload file error!' });
    }

    // Lấy userId từ URL và kiểm tra tính hợp lệ
    const { userId } = req.params;
    const { groupName, privacy, description } = req.body;

    try {
      const user = await User.findOne({ ID: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Tạo đối tượng nhóm mới
      const groupId = await generateGroupId();
      const newGroup = new Group({
        ID: groupId,
        TenNhom: groupName,
        QuyenRiengTu: privacy,
        GioiThieu: description,
        NgayTao: new Date(),
        AnhDaiDien: req.file ? req.file.filename : '/DefaultGroup.png',
        QuanTriVien: user._id, 
        ThanhVien: user._id 
      });

      // Lưu nhóm mới vào database
      const savedGroup = await newGroup.save();

      // Cập nhật User với nhóm mới
      user.NhomQuanTri.push(savedGroup._id);
      user.NhomThamGia.push(savedGroup._id);
      await user.save();

      res.status(200).json(savedGroup);
    } catch (error) {
      console.error('Save group error:', error);
      res.status(400).json({ message: error.message });
    }
  });
};

// Update group by ID
exports.updateGroup = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload file error!' });
    }

    const { groupId, groupName, members, description } = req.body;

    const updateData = {
      ID: groupId,
      TenNhom: groupName,
      ThanhVien: members,
      MoTa: description
    };

    if (req.file) {
      updateData.AnhDaiDien = req.file.filename;
    }

    try {
      const updatedGroup = await Group.findOneAndUpdate({ ID: groupId }, updateData, { new: true });

      if (!updatedGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }

      console.log('Updated group:', updatedGroup);
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error('Update group error:', error);
      res.status(400).json({ message: error.message });
    }
  });
};

// Đổi giá trị sách thành 0 để xóa
exports.updateValue = async (req, res) => {
  const { id, giatri } = req.body;
  try {
    const result = await Group.updateMany({ ID: id }, { $set: { GiaTri: giatri } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Đổi giá trị tất cả sách thành 0 để xóa
exports.updateAllValue = async (req, res) => {
  const { giatri } = req.body;
  try {
    const result = await Group.updateMany({}, { $set: { GiaTri: giatri } }); 
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Xóa nhóm theo ID
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGroup = await Group.findOneAndDelete({ ID: id });

    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    return res.status(500).json({ message: 'Error deleting group', error: error.message });
  }
};

// Xóa tất cả sách trong hàng chờ đã xóa gần đây
exports.deleteGroupsWithValueZero = async (req, res) => {
  try {
    const deleteResult = await Group.deleteMany({ GiaTri: 0 });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No groups to delete' });
    }

    return res.status(200).json({ message: 'Groups deleted successfully' });
  } catch (error) {
    console.error('Error deleting groups with value 0:', error);
    return res.status(500).json({ message: 'Error deleting groups with value 0', error: error.message });
  }
};

// Xóa tất cả nhóm
exports.deleteAllGroups = async (req, res) => {
  try {
    const deleteResult = await Group.deleteMany();

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No groups found to delete' });
    }

    return res.status(200).json({ message: 'All groups deleted successfully' });
  } catch (error) {
    console.error('Error deleting all groups:', error);
    return res.status(500).json({ message: 'Error deleting all groups', error: error.message });
  }
};
