const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  ID: { type: String, required: true, unique: true },
  NoiDung: { type: String, required: true },
  NgayBL: { type: Date, required: true, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' } 
});

const Comment = mongoose.model('Comment', commentSchema, 'dsbinhluan');
module.exports = Comment;
