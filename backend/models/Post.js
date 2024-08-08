const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  ID: { type: String, required: true, unique: true },
  TenTopic: { type: String, required: true },
  ThoiGian: { type: Date, required: true },
  BinhLuan: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  userId: { type: Schema.Types.ObjectId, ref: 'User' } 
});

const Post = mongoose.model('Post', postSchema, 'dsthaoluan');
module.exports = Post;
