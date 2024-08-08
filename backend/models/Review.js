const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  ID: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  NgayViet: { type: Date, default: Date.now },
  SoDiem: {
    type: Number,
    min: [1, 'SoDiem phải lớn hơn hoặc bằng 1'],
    max: [5, 'SoDiem phải nhỏ hơn hoặc bằng 5'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value);
      },
      message: 'SoDiem phải là một số hợp lệ'
    }
  },
  Sach: { type: Schema.Types.ObjectId, ref: 'Book' },
  NoiDung: String
});

const Review = mongoose.model('Review', reviewSchema, 'dsdanhgia');
module.exports = Review;