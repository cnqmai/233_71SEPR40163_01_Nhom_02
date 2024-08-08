const Author = require('../models/Author');
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');

// Lấy 1 tác giả theo ID
exports.getAuthorByID = async (req, res) => {
    try {
        const authorId = req.params.id;
        const author = await Author.findOne({ ID: authorId }).populate('TacPham'); // Populate danh sách tác phẩm
        res.json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy 1 tác giả theo  oID
exports.getAuthorByObjectID = async (req, res) => {
    try {
        const authorId = req.params.objectid;
        const author = await Author.findOne({ _id: authorId }).populate('TacPham'); // Populate danh sách tác phẩm
        res.json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy 1 tác giả theo Tên
exports.getAuthorByName = async (req, res) => {
    try {
        const authorName = req.params.name;
        console.log(`Fetching information for author: ${authorName}`);
        const author = await Author.findOne({ HoTen: authorName }).populate('TacPham'); // Populate danh sách tác phẩm

        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        res.json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Lấy top 3
exports.getTop3Authors = async (req, res) => {
    try {
      const topAuthors = await Book.aggregate([
        // Giai đoạn 1: Liên kết bảng Book với bảng Author và Review
        {
          $lookup: {
            from: 'dstacgia', // Tên bảng tác giả trong cơ sở dữ liệu
            localField: 'TacGia',
            foreignField: '_id',
            as: 'TacGiaChiTiet'
          }
        },
        {
          $lookup: {
            from: 'dsdanhgia', // Tên bảng đánh giá trong cơ sở dữ liệu
            localField: 'DanhGia',
            foreignField: '_id',
            as: 'ChiTietDanhGia'
          }
        },
        // Giai đoạn 2: Tính tổng số điểm của các review và chỉ giữ lại các trường cần thiết
        {
          $addFields: {
            TotalScore: { $sum: '$ChiTietDanhGia.SoDiem' },
            SoLuotDanhGia: { $size: '$ChiTietDanhGia' }
          }
        },
        {
          $project: {
            TacGiaChiTiet: 1,
            TotalScore: 1,
            SoLuotDanhGia: 1,
            SoLuotQuanTam: 1,
          }
        },
        // Giai đoạn 3: Sắp xếp các sách theo SoLuotQuanTam giảm dần
        { $sort: { SoLuotQuanTam: -1 } },
        // Giai đoạn 4: Nhóm theo tác giả và tính tổng lượt đánh giá
        {
          $group: {
            _id: '$TacGiaChiTiet._id', // Nhóm theo ID của tác giả để lấy thông tin đầy đủ
            HoTen: { $first: '$TacGiaChiTiet.HoTen' },
            AnhTacGia: { $first: '$TacGiaChiTiet.AnhTacGia' },
            totalReviews: { $sum: '$SoLuotDanhGia' },
            totalScore: { $sum: '$TotalScore' },
            SoLuotQuanTam: { $first: '$SoLuotQuanTam' } // Giữ lại SoLuotQuanTam của sách có SoLuotQuanTam cao nhất
          }
        },
        // Giai đoạn 5: Sắp xếp theo tổng lượt quan tâm, tổng điểm và tổng lượt đánh giá giảm dần
        { $sort: { SoLuotQuanTam: -1, totalReviews: -1, totalScore: -1 } },
        // Giai đoạn 6: Giới hạn kết quả chỉ lấy 3 tác giả
        { $limit: 3 },
      ]);
  
      res.json(topAuthors);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy top 3 tác giả', error });
    }
};

// Lấy tất cả tác giả
exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find({ GiaTri: 1 }).populate('TacPham'); // Populate danh sách tác phẩm
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy các tác giả vào hàng chờ đã xóa gần đây
exports.getAllAuthorsValueZero = async (req, res) => {
    try {
        const authors = await Author.find({ GiaTri: 0 }).populate('TacPham'); // Populate danh sách tác phẩm
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tìm kiếm tác giả theo id / tên
exports.searchAuthors = async (req, res) => {
    const { query } = req.query;
    try {
        const authors = await Author.find({
            $or: [
                { HoTen: new RegExp(query, 'i') },
                { ID: new RegExp(query, 'i') }
            ]
        }).populate('TacPham'); // Populate danh sách tác phẩm
        res.json(authors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Cấu hình lưu trữ file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Đường dẫn đến thư mục public/images từ thư mục của authorController.js
        const uploadPath = path.join(__dirname, '../../frontend/public/images');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Tên file sau khi lưu
    }
});

// Cấu hình middleware Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Giới hạn kích thước file upload (ví dụ: 5MB)
    },
    fileFilter: function (req, file, cb) {
        // Kiểm tra loại file cho phép upload
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
}).single('authorImage'); // Tên của trường chứa file ảnh bìa (phải khớp với tên trường trong FormData của React)

// Middleware xử lý yêu cầu POST tạo tác giả mới
exports.createAuthor = async (req, res) => {
    // Dùng middleware upload để xử lý upload file trước khi tạo tác giả
    upload(req, res, async function (err) {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ message: 'Upload file error!' });
        }

        // Dữ liệu từ body request
        const { authorId, authorName, birthPlace, birthDate, introduction, works } = req.body;

        // Tạo mới đối tượng Author từ dữ liệu nhận được và đặt GiaTri mặc định là 1
        const newAuthor = new Author({
            ID: authorId,
            HoTen: authorName,
            NoiSinh: birthPlace,
            NgaySinh: birthDate,
            GioiThieu: introduction,
            TacPham: works,
            AnhTacGia: req.file ? req.file.filename : '', // Lưu tên file ảnh đại diện vào cơ sở dữ liệu
            GiaTri: 1,
        });

        try {
            const savedAuthor = await newAuthor.save();
            res.status(200).json(savedAuthor); // Trả về tác giả đã được lưu thành công
        } catch (error) {
            console.error('Save author error:', error); // Log lỗi chi tiết nếu có
            res.status(400).json({ message: error.message }); // Xử lý lỗi nếu không thể lưu tác giả
        }
    });
};

// Update bằng ID
exports.updateAuthor = async (req, res) => {
    // Dùng middleware upload để xử lý upload file trước khi cập nhật tác giả
    upload(req, res, async function (err) {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ message: 'Upload file error!' });
        }

        // Dữ liệu từ body request
        const { authorId, authorName, birthPlace, birthDate, introduction } = req.body;
        
        // Tạo đối tượng dữ liệu cập nhật
        const updateData = {};

        // Cập nhật các trường không phải là ObjectId
        if (authorName) updateData.HoTen = authorName;
        if (birthPlace) updateData.NoiSinh = birthPlace;
        if (birthDate) updateData.NgaySinh = birthDate;
        if (introduction) updateData.GioiThieu = introduction;

        // Nếu có file upload thì cập nhật ảnh đại diện
        if (req.file) {
            updateData.AnhTacGia = req.file.filename;
        }

        try {
            const updatedAuthor = await Author.findOneAndUpdate(
                { ID: authorId },
                updateData,
                { new: true } // Trả về bản ghi cập nhật
            );

            if (!updatedAuthor) {
                return res.status(404).json({ message: 'Author not found' });
            }

            console.log('Updated author:', updatedAuthor);
            res.status(200).json(updatedAuthor);
        } catch (error) {
            console.error('Update author error:', error); // Log lỗi chi tiết nếu có
            res.status(400).json({ message: error.message }); // Xử lý lỗi nếu không thể cập nhật tác giả
        }
    });
};

// Đổi giá trị tác giả thành 0 để xóa
exports.updateValue = async (req, res) => {
    const { id, giatri } = req.body;
    try {
        const result = await Author.updateMany({ ID: id }, { $set: { GiaTri: giatri } });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Đổi giá trị tất cả tác giả thành 0 để xóa
exports.updateAllValue = async (req, res) => {
    const { giatri } = req.body;
    try {
      const result = await Author.updateMany({}, { $set: { GiaTri: giatri } }); 
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

// Xóa tác giả theo ID
exports.deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAuthor = await Author.findOneAndDelete({ ID: id });

        if (!deletedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        console.error('Error deleting author:', error);
        return res.status(500).json({ message: 'Error deleting author', error: error.message });
    }
};

// Xóa tất cả tác giả trong hàng chờ đã xóa gần đây
exports.deleteAuthorsWithValueZero = async (req, res) => {
    try {
        const deleteResult = await Author.deleteMany({ GiaTri: 0 });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'No authors to delete' });
        }

        return res.status(200).json({ message: 'Authors deleted successfully' });
    } catch (error) {
        console.error('Error deleting authors with value 0:', error);
        return res.status(500).json({ message: 'Error deleting authors with value 0', error: error.message });
    }
};

// Xóa tất cả tác giả
exports.deleteAllAuthors = async (req, res) => {
    try {
        const deleteResult = await Author.deleteMany();

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'No authors found to delete' });
        }

        return res.status(200).json({ message: 'All authors deleted successfully' });
    } catch (error) {
        console.error('Error deleting all authors:', error);
        return res.status(500).json({ message: 'Error deleting all authors', error: error.message });
    }
};
