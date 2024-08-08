const Post = require('../models/Post');
const User = require('../models/User');
const Group = require('../models/Group')
const { generatePostId } = require('../utils/functions');
const mongoose = require('mongoose');

// Lấy posts có comment
exports.getPostWithComments = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate({
      path: 'BinhLuan',
      populate: { path: 'userId', select: 'TenTaiKhoan AnhDaiDien' } 
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm bài đăng
exports.addPost = async (req, res) => {
  const { tenTopic, groupId } = req.body; 
  const customUserId = req.userId; 
  const newPostId = await generatePostId();

  // Kiểm tra dữ liệu đầu vào
  if (!tenTopic || !groupId) {
      return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ' });
  }

  try {
      // Tìm người dùng bằng custom userId
      const user = await User.findOne({ ID: customUserId });
      if (!user) {
          return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      // Tìm nhóm bằng groupId
      console.log(groupId)
      const group = await Group.findOne({_id: groupId});
      if (!group) {
          return res.status(404).json({ message: 'Không tìm thấy nhóm' });
      }

      const newPost = new Post({
          ID: newPostId,
          TenTopic: tenTopic,
          ThoiGian: new Date(),
          BinhLuan: [],
          userId: user._id
      });

      await newPost.save();

      // Cập nhật nhóm để thêm bài đăng vào trường BaiDang
      await Group.findByIdAndUpdate(groupId, {
          $push: { BaiDang: newPost._id }
      });

      await group.save();
      
      res.status(201).json({ message: 'Bài đăng đã được thêm thành công' });
  } catch (error) {
      console.error('Lỗi khi thêm bài đăng:', error.message);
      console.error(error.stack);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};