const Review = require('../models/Review');
const Book = require('../models/Book'); 
const User = require('../models/User');
const { generateReviewId } = require('../utils/functions');

// Lấy đánh giá của sách theo tên sách
exports.getReviewsByBookName = async (req, res) => {
    try {
        const bookName = req.params.name; 
        const reviews = await Review.find({ TenSach: bookName })
            .populate('userId', 'TenTaiKhoan AnhDaiDien') // Chỉ lấy các trường cần thiết
            .exec();
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Server error');
    }
};

// Lấy đánh giá của sách theo id người dùng
exports.getReviewsByUserID = async (req, res) => {
    try {
        const userId = req.params.userid;

        // Tìm ObjectId của người dùng theo ID tự đặt
        const user = await User.findOne({ ID: userId });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Tìm các đánh giá của người dùng
        const reviews = await Review.find({ userId: user._id }) // Tìm theo ObjectId của người dùng
            .populate({
                path: 'Sach', // Populate trường Sach
                select: 'TieuDe AnhBia TacGia', // Chọn các trường cần thiết
                populate: {
                    path: 'TacGia', // Populate trường TacGia trong Sach
                    select: 'HoTen' // Chọn các trường cần thiết trong TacGia
                }
            })
            .populate('userId', 'ID TenTaiKhoan AnhDaiDien') // Populate trường userId để lấy thông tin người dùng
            .exec();

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Server error');
    }
};

// Thêm đánh giá
exports.addReview = async (req, res) => {
    const { bookId, reviewContent, reviewRating } = req.body;
    const customUserId = req.userId; 
    const newReviewId = await generateReviewId();

    // Kiểm tra dữ liệu đầu vào
    if (!bookId || !reviewContent || reviewRating == null || reviewRating < 1 || reviewRating > 5) {
        return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ' });
    }

    try {
        // Tìm người dùng bằng custom userId
        const user = await User.findOne({ ID: customUserId });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Tìm sách bằng bookId
        const book = await Book.findOne({ _id: bookId });
        if (!book) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        const newReview = new Review({
            ID: newReviewId,
            Sach: book._id,
            userId: user._id,
            NoiDung: reviewContent,
            SoDiem: reviewRating,
            NgayViet: new Date()
        });
        
        await newReview.save();
        
        // Cập nhật sách để thêm đánh giá vào trường DanhGia
        await Book.findByIdAndUpdate(bookId, {
            $push: { DanhGia: newReview._id }
        });

        // Lưu tài liệu sách với đánh giá mới
        await book.save();

        res.status(201).json({ message: 'Đánh giá đã được thêm thành công' });
    } catch (error) {
        console.error('Lỗi khi thêm đánh giá:', error.message);
        console.error(error.stack);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};
