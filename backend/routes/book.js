const express = require('express');
const router = express.Router();
const path = require('path');
const bookController = require('../controllers/bookController');

// Route LẤY tất cả sách
router.get('/getallbooks', bookController.getAllBooks);

// Route LẤY danh sách đã xóa gần đây
router.get('/getallbooksvaluezero', bookController.getAllBooksValueZero);

// Route Lấy top 3 sách có rating cao nhất
router.get('/gettop3booksbyrating', bookController.getTop3RatingBooks);

// Đã đọc
router.get('/readbooks/:userid', bookController.getReadBooks);

// Đang đọc
router.get('/readingbooks/:userid', bookController.getReadingBooks);

// Muốn đọc
router.get('/wantoreadbooks/:userid', bookController.getWantToReadBooks);

// Route lấy 1 sách theo id
router.get('/getbookbyid/:id', bookController.getBookByID);

// Route lấy 1 sách theo tên
router.get('/getbookbyname/:name', bookController.getBookByName);

// Route lấy sách theo thể loại
router.get('/getbooksbygenres/:genre', bookController.getBooksByGenre);

// Route TÌM KIẾM sách theo tiêu đề / tác giả
router.get('/searchbooks', bookController.searchBooks);

// Route THÊM sách mới
router.post('/addbooks', bookController.createBook);

// Route CẬP NHẬT sách 
router.put('/updatebook/:id', bookController.updateBook);

// Route THAY ĐỔI giá trị sách để đưa 1 sách vào đã xóa gần đây
router.put('/changevalueofbooktodelete', bookController.updateValue);

// Route THAY ĐỔI giá trị sách để đưa tất cả sách vào đã xóa gần đây
router.put('/changevalueofallbookstodelete', bookController.updateAllValue);

// Route THAY ĐỔI giá trị sách để khôi phục 1 sách
router.put('/changevalueofbooktorestore', bookController.updateValue);

// Route THAY ĐỔI giá trị sách để khôi phục tất cả sách
router.put('/changevalueofallbookstorestore', bookController.updateAllValue);

// Route XÓA sách được chọn
router.delete('/deletebook/:id', bookController.deleteBook);

// Route XÓA tất cả sách trong đã xóa gần đây
router.delete('/deleteallbooks', bookController.deleteBooksWithValueZero);

module.exports = router;
