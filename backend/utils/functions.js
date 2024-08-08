const User = require('../models/User');
const Group = require('../models/Group');
const Review = require('../models/Review');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const generatePostId = async () => {
  const currentYear = new Date().getFullYear().toString();
  const lastPost = await Post.findOne({ ID: { $regex: `^POST${currentYear}` } }).sort({ ID: -1 });

  if (lastPost) {
    const lastPostId = lastPost.ID;
    const lastPostNumber = parseInt(lastPostId.substring(8));
    const newPostNumber = (lastPostNumber + 1).toString().padStart(6, '0');
    return `POST${currentYear}${newPostNumber}`;
  } else {
    return `POST${currentYear}000001`;
  }
};

const generateReviewId = async () => {
  const currentYear = new Date().getFullYear().toString();
  
  // Tìm review có ID lớn nhất trong năm hiện tại
  const lastReview = await Review.findOne({ ID: { $regex: `^REVIEW${currentYear}` } }).sort({ ID: -1 });

  if (lastReview) {
    const lastReviewId = lastReview.ID;
    const lastReviewNumber = parseInt(lastReviewId.substring(12)); // Lấy phần số từ ID
    const newReviewNumber = (lastReviewNumber + 1).toString().padStart(6, '0'); // Tăng số thứ tự
    return `REVIEW${currentYear}${newReviewNumber}`;
  } else {
    return `REVIEW${currentYear}000001`; // Nếu chưa có review nào trong năm hiện tại
  }
};


const generateUserId = async () => {
  const currentYear = new Date().getFullYear().toString();
  const lastUser = await User.findOne({ ID: { $regex: `^USER${currentYear}` } }).sort({ ID: -1 });

  if (lastUser) {
    const lastUserId = lastUser.ID;
    const lastUserNumber = parseInt(lastUserId.substring(8));
    const newUserNumber = (lastUserNumber + 1).toString().padStart(6, '0');
    return `USER${currentYear}${newUserNumber}`;
  } else {
    return `USER${currentYear}000001`;
  }
};

const generateGroupId = async () => {
  const currentYear = new Date().getFullYear().toString();
  const lastGroup = await Group.findOne({ ID: { $regex: `^GROUP${currentYear}` } }).sort({ ID: -1 });

  if (lastGroup) {
    const lastGroupId = lastGroup.ID;
    const lastGroupNumber = parseInt(lastGroupId.substring(9));
    const newGroupNumber = (lastGroupNumber + 1).toString().padStart(4, '0');
    return `GROUP${currentYear}${newGroupNumber}`;
  } else {
    return `GROUP${currentYear}0001`;
  }
};

const generateCommentId = async () => {
  const currentYear = new Date().getFullYear().toString();
  const prefix = 'COMMENT';

  // Tìm ID lớn nhất hiện có trong cơ sở dữ liệu
  const lastComment = await Comment.findOne({ ID: { $regex: `^${prefix}${currentYear}` } })
                                   .sort({ ID: -1 });

  if (lastComment) {
    const lastCommentId = lastComment.ID;
    const lastCommentNumber = parseInt(lastCommentId.substring(prefix.length + currentYear.length));
    const newCommentNumber = (lastCommentNumber + 1).toString().padStart(4, '0');
    return `${prefix}${currentYear}${newCommentNumber}`;
  } else {
    return `${prefix}${currentYear}0001`;
  }
};

const getBookInterestCount = async (bookId) => {
  try {
    // Đếm số người dùng có sách trong danh mục "Đang Đọc"
    const dangDocCount = await User.countDocuments({ DangDoc: bookId });
    
    // Đếm số người dùng có sách trong danh mục "Muốn đọc"
    const muonDocCount = await User.countDocuments({ MuonDoc: bookId });

    // Đếm số người dùng có sách trong danh mục "Muốn đọc"
    const daDocCount = await User.countDocuments({ DaDoc: bookId });

    // Tính tổng số lượt quan tâm
    const totalInterest = dangDocCount + muonDocCount;

    return totalInterest;
  } catch (error) {
    console.error('Error getting book interest count:', error);
    throw error;
  }
}
  
module.exports = { 
  formatDate,
  generateUserId,
  generateGroupId,
  generateCommentId,
  generateReviewId,
  generatePostId,
  getBookInterestCount
};