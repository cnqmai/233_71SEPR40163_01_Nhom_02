const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  ID: { type: String, required: true, unique: true },
  TenTheLoai: { type: String, required: true }
});

const Genre = mongoose.model('Genre', genreSchema, 'dstheloai');
module.exports = Genre;
