const express = require('express');
const router = express.Router();
const path = require('path');
const authorController = require('../controllers/authorController');

// Định nghĩa route cho việc lấy danh tác giả tác giả
router.get('/getallauthors', authorController.getAllAuthors);

// Route lấy danh tác giả đã xóa gần đây
router.get('/getallauthorsvaluezero', authorController.getAllAuthorsValueZero);

// Route lấy top 3 author
router.get('/gettop3authors', authorController.getTop3Authors);

// Route lấy 1 author theo id
router.get('/getauthorbyid/:id', authorController.getAuthorByID);

// Route lấy 1 author theo object id
router.get('/getauthorbyobjectid/:objectid', authorController.getAuthorByObjectID);

// Route lấy 1 author theo tên
router.get('/getauthorbyname/:name', authorController.getAuthorByName);

// Route tìm kiếm tác giả theo tiêu đề / tác giả
router.get('/searchauthors', authorController.searchAuthors);

// Route thêm tác giả mới
router.post('/addauthors', authorController.createAuthor);

// Route cập nhật tác giả 
router.put('/updateauthor/:id', authorController.updateAuthor);

// Route THAY ĐỔI giá trị tác giả để đưa 1 tác giả vào đã xóa gần đây
router.put('/changevalueofauthortodelete', authorController.updateValue);

// Route THAY ĐỔI giá trị tác giả để đưa tất cả tác giả vào đã xóa gần đây
router.put('/changevalueofallauthorstodelete', authorController.updateAllValue);

// Route THAY ĐỔI giá trị tác giả để khôi phục 1 tác giả
router.put('/changevalueofauthortorestore', authorController.updateValue);

// Route THAY ĐỔI giá trị tác giả để khôi phục tất cả tác giả
router.put('/changevalueofallauthorstorestore', authorController.updateAllValue);

// Route xóa tác giả được chọn
router.delete('/deleteauthor/:id', authorController.deleteAuthor);

// Route xóa tất cả tác giả trong đã xóa gần đây
router.delete('/deleteallauthors', authorController.deleteAuthorsWithValueZero);

module.exports = router;
