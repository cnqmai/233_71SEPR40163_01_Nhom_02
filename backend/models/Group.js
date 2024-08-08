const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  ID: { type: String, required: true, unique: true },
  TenNhom: { type: String, required: true },
  QuanTriVien: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  NgayTao: { type: Date, default: Date.now },
  AnhDaiDien: { type: String, default: '/DefaultGroup.png' },
  GioiThieu: { type: String },
  GiaTri: { type: Number, default: 1 },
  QuyenRiengTu: { type: String },
  BaiDang: [{ type: Schema.Types.ObjectId, ref: 'Post' }], 
  ThanhVien: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
});

const Group = mongoose.model('Group', groupSchema, 'dsnhom');
module.exports = Group;
