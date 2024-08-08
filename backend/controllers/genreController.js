const Genre = require('../models/Genre');

// Lấy tất cả 
exports.getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};