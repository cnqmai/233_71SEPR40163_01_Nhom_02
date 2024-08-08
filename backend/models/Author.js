const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  ID: { type: String, required: true, unique: true },
  HoTen: { type: String, required: true },
  NoiSinh: { type: String },
  NgaySinh: String,
  GioiThieu: String,
  TacPham: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  AnhTacGia: String,
  Website: String,
  TheLoai: [String],
  GiaTri: { type: Number, default: 1 }
});

const Author = mongoose.model('Author', authorSchema, 'dstacgia');
module.exports = Author;
