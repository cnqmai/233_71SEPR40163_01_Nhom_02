const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  ID: { type: String, required: true },
  TenTaiKhoan: { type: String, required: true },
  HoTen: { type: String, required: true },
  Email: { type: String, required: true },
  MatKhau: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  NgaySinh: { type: String, default: '' },
  NgayTao: { type: Date, default: Date.now },
  GioiTinh: { type: String, default: '' },
  GioiThieu: { type: String, default: '' },
  ThanhPho: { type: String, default: '' },
  SoThich: { type: [String], default: [] },
  AnhDaiDien: { type: String, default: '/UnknownUser.jpg' },
  GiaTri: { type: Number, default: 1 },
  Admin: { type: Number, default: 0},
  NhomQuanTri: { type: [mongoose.Schema.Types.ObjectId], ref: 'Group', default: []},
  NhomThamGia: { type: [mongoose.Schema.Types.ObjectId], ref: 'Group', default: []},
  MuonDoc: { type: [mongoose.Schema.Types.ObjectId], ref: 'Book', default: [] },
  DangDoc: { type: [mongoose.Schema.Types.ObjectId], ref: 'Book', default: [] },
  DaDoc: { type: [mongoose.Schema.Types.ObjectId], ref: 'Book', default: [] },
  NguoiTheoDoi: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  DangTheoDoi: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.MatKhau);
};

const User = mongoose.model('User', userSchema, 'dstaikhoan');
module.exports = User;
