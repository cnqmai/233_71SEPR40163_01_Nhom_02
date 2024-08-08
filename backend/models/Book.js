const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  ID: { type: String, required: true, unique: true },
  SoLuotQuanTam: { type: Number, default: 0 },
  TieuDe: { type: String, required: true },
  DanhGia: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  AnhBia: String,
  TacGia: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
  TheLoai: [String],
  SoTrang: Number,
  LoaiBia: String,
  NgonNgu: String,
  NgayXB: String,
  TomTat: String,
  BoiCanh: String,
  GiaTri: { type: Number, default: 1 }
});

const Book = mongoose.model('Book', bookSchema, 'dssach');
module.exports = Book;
