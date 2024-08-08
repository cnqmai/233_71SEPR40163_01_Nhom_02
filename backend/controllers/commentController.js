const Comment = require('../models/Comment');
const User = require('../models/User'); 
const Post = require('../models/Post'); 
const { generateCommentId } = require('../utils/functions');

// Thêm bình luận
exports.addComment = async (req, res) => {
  const { postId, NoiDung } = req.body;
  const customUserId = req.userId; 
  const newCommentId = await generateCommentId();

  if (!postId || !NoiDung) {
    return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ' });
  }
  
  try {
    // Tìm người dùng bằng custom userId
    const user = await User.findOne({ ID: customUserId });
    if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }    
    
    // Tìm sách bằng postId
    const post = await Post.findOne({ _id: postId });
    if (!post) {
        return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    
    // Tạo bình luận mới
    const newComment = new Comment({
      ID: newCommentId,
      NoiDung,
      userId: user._id,
      postId: post._id,
      NgayBL: new Date()
    });

    // Lưu bình luận vào cơ sở dữ liệu
    const savedComment = await newComment.save();

    // Cập nhật bài viết với bình luận mới
    await Post.findByIdAndUpdate(postId, {
      $push: { BinhLuan: savedComment._id } 
    });

    res.status(200).json({
      message: 'Bình luận đã được thêm thành công!',
      comment: savedComment
    });
  } catch (error) {
    console.error('Lỗi khi thêm bình luận:', error);
    res.status(500).json({
      message: 'Đã xảy ra lỗi khi thêm bình luận',
      error: error.message
    });
  }
};
