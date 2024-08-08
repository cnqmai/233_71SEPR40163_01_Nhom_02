const Book = require('../models/Book');
const User = require('../models/User');
const Author = require('../models/Author');
const multer = require('multer');
const path = require('path');

exports.getReadBooks = async (req, res) => {
  try {
    const userId = req.params.userid;

    // Tìm người dùng theo userId tùy chỉnh
    const user = await User.findOne({ ID: userId }).populate('DaDoc');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.DaDoc);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching read books' });
  }
};

exports.getReadingBooks = async (req, res) => {
  try {
    const userId = req.params.userid;

    // Tìm người dùng theo userId tùy chỉnh
    const user = await User.findOne({ ID: userId }).populate('DangDoc');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.DangDoc);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reading books' });
  }
};

exports.getWantToReadBooks = async (req, res) => {
  try {
    const userId = req.params.userid;

    // Tìm người dùng theo userId tùy chỉnh
    const user = await User.findOne({ ID: userId }).populate('MuonDoc');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.MuonDoc);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books to read' });
  }
};

// Lấy 1 sách theo ID
exports.getBookByID = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findOne({ ID: bookId })
      .populate({
        path: 'DanhGia',
        select: 'ID userId SoDiem NoiDung NgayViet',
        populate: {
          path: 'userId',
          select: 'TenTaiKhoan'
        }
      })
      .populate({
        path: 'TacGia',
        select: 'ID HoTen'
      });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
      res.json(book);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Lấy 1 sách theo Tên
exports.getBookByName = async (req, res) => {
  try {
    const bookName = req.params.name;

    // Tìm sách và populate các đánh giá và tác giả
    const book = await Book.findOne({ TieuDe: bookName })
      .populate({
        path: 'DanhGia',
        select: 'ID userId SoDiem NoiDung NgayViet',
        populate: {
          path: 'userId',
          select: 'TenTaiKhoan AnhDaiDien'
        }
      })
      .populate({
        path: 'TacGia',
        select: 'ID HoTen'
      });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    console.error(err); // Thêm log lỗi để kiểm tra nguyên nhân
    res.status(500).json({ message: err.message });
  }
};


// Lấy sách theo thể loại
exports.getBooksByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const books = await Book.find({ TheLoai: genre })
    
    if (books.length === 0) {
        return res.status(404).json({ message: 'No books found for this genre' });
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy 3 sách có đánh giá cao nhất
exports.getTop3RatingBooks = async (req, res) => {
  try {
    const topBooks = await Book.find()
      .sort({ DanhGia: -1 })
      .limit(3)
      .populate({
        path: 'DanhGia',
        select: 'ID userId SoDiem NoiDung NgayViet',
        populate: {
          path: 'userId',
          select: 'TenTaiKhoan'
        }
      })
      .populate({
        path: 'TacGia',
        select: 'ID HoTen'
      });

    res.json(topBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top rated books' });
  }
};

// Lấy tất cả sách
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ GiaTri: 1 })
    .populate({
      path: 'DanhGia',
      select: 'ID userId SoDiem NoiDung NgayViet', // Chọn các trường cần thiết từ Review
      populate: {
        path: 'userId',
        select: 'TenTaiKhoan' // Chọn các trường cần thiết từ User nếu cần
      }
    })
    .populate({
      path: 'TacGia',
      select: 'ID HoTen', // Chọn các trường cần thiết từ Author
    });
    
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy các sách vào hàng chờ đã xóa gần đây
exports.getAllBooksValueZero = async (req, res) => {
  try {
      const books = await Book.find({ GiaTri: 0 });
      res.json(books);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Tìm kiếm sách theo id / tiêu đề / sách
exports.searchBooks = async (req, res) => {
  const { query } = req.query;

  try {
    // Tìm kiếm theo tiêu đề hoặc ID sách
    const books = await Book.find({
      $or: [
        { TieuDe: new RegExp(query, 'i') },
        { ID: new RegExp(query, 'i') }
      ]
    })
    .populate({
      path: 'DanhGia',
      select: 'ID userId SoDiem NoiDung NgayViet',
      populate: {
        path: 'userId',
        select: 'TenTaiKhoan'
      }
    });

    // Tìm kiếm các tác giả theo tên
    const authors = await Author.find({
      HoTen: new RegExp(query, 'i')
    });

    // Lấy danh sách các ID tác giả
    const authorIds = authors.map(author => author._id);

    // Tìm kiếm sách mà có ít nhất một tác giả trong danh sách các ID tác giả
    const booksByAuthor = await Book.find({
      TacGia: { $in: authorIds }
    })
    .populate({
      path: 'DanhGia',
      select: 'ID userId SoDiem NoiDung NgayViet',
      populate: {
        path: 'userId',
        select: 'TenTaiKhoan'
      }
    })
    .populate({
      path: 'TacGia',
      select: 'ID HoTen'
    });

    // Kết hợp kết quả tìm kiếm theo sách và tác giả
    const combinedBooks = [...books, ...booksByAuthor];

    // Loại bỏ sách trùng lặp (nếu cần)
    const uniqueBooks = Array.from(new Set(combinedBooks.map(book => book._id.toString())))
      .map(id => {
        return combinedBooks.find(book => book._id.toString() === id);
      });

    res.json(uniqueBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Cấu hình lưu trữ file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Đường dẫn đến thư mục public/images từ thư mục của bookcontroller.js
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
}).single('coverImage'); // Tên của trường chứa file ảnh bìa (phải khớp với tên trường trong FormData của React)

// Middleware xử lý yêu cầu POST tạo sách mới
exports.createBook = async (req, res) => {
  // Dùng middleware upload để xử lý upload file trước khi tạo sách
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload file error!' });
    }

    // Dữ liệu từ body request
    const { bookId, bookName, authorName, category, publishDate, coverType, language, pageCount, context, summary } = req.body;

    // Tạo mới đối tượng Book từ dữ liệu nhận được và đặt GiaTri mặc định là 1
    const newBook = new Book({
      ID: bookId,
      TieuDe: bookName,
      TacGia: [authorName],
      TheLoai: category,
      NgayXB: publishDate,
      LoaiBia: coverType,
      NgonNgu: language,
      SoTrang: pageCount,
      BoiCanh: context,
      TomTat: summary,
      AnhBia: req.file ? req.file.filename : '', // Lưu tên file ảnh bìa vào cơ sở dữ liệu
      GiaTri: 1, 
    });
    
    try {
      const savedBook = await newBook.save();
      res.status(200).json(savedBook); // Trả về sách đã được lưu thành công
    } catch (error) {
      console.error('Save book error:', error); // Log lỗi chi tiết nếu có
      res.status(400).json({ message: error.message }); // Xử lý lỗi nếu không thể lưu sách
    }
  });
};

// Update book by ID
exports.updateBook = async (req, res) => {
  // Dùng middleware upload để xử lý upload file trước khi cập nhật sách
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload file error!' });
    }

    // Dữ liệu từ body request
    const { bookId, bookName, authorName, category, publishDate, coverType, language, pageCount, context, summary } = req.body;

    // Dữ liệu cập nhật
    const updateData = {
      ID: bookId,
      TieuDe: bookName,
      TacGia: [authorName],
      TheLoai: category,
      NgayXB: publishDate,
      LoaiBia: coverType,
      NgonNgu: language,
      SoTrang: pageCount,
      BoiCanh: context,
      TomTat: summary,
    };

    // Nếu có file upload thì cập nhật ảnh bìa
    if (req.file) {
      updateData.AnhBia = req.file.filename;
    }

    try {
      const updatedBook = await Book.findOneAndUpdate({ ID: bookId }, updateData, { new: true });

      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }

      console.log('Updated book:', updatedBook);
      res.status(200).json(updatedBook);
    } catch (error) {
      console.error('Update book error:', error); // Log lỗi chi tiết nếu có
      res.status(400).json({ message: error.message }); // Xử lý lỗi nếu không thể cập nhật sách
    }
  });
};

// Đổi giá trị sách thành 0 để xóa
exports.updateValue = async (req, res) => {
  const { id, giatri } = req.body;
  try {
    const result = await Book.updateMany({ ID: id }, { $set: { GiaTri: giatri } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Đổi giá trị tất cả sách thành 0 để xóa
exports.updateAllValue = async (req, res) => {
  const { giatri } = req.body;
  try {
    const result = await Book.updateMany({}, { $set: { GiaTri: giatri } }); 
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};



// Xóa sách theo ID
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findOneAndDelete({ ID: id });

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

// Xóa tất cả sách trong hàng chờ đã xóa gần đây
exports.deleteBooksWithValueZero = async (req, res) => {
  try {
    const deleteResult = await Book.deleteMany({ GiaTri: 0 });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No books to delete' });
    }

    return res.status(200).json({ message: 'Books deleted successfully' });
  } catch (error) {
    console.error('Error deleting books with value 0:', error);
    return res.status(500).json({ message: 'Error deleting books with value 0', error: error.message });
  }
};

// Xóa tất cả sách
exports.deleteAllBooks = async (req, res) => {
  try {
    const deleteResult = await Book.deleteMany();

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No books found to delete' });
    }

    return res.status(200).json({ message: 'All books deleted successfully' });
  } catch (error) {
    console.error('Error deleting all books:', error);
    return res.status(500).json({ message: 'Error deleting all books', error: error.message });
  }
};

