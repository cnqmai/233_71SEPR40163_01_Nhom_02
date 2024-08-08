const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/userController');

// Route theo dõi người dùng
router.post('/follow/:userId', userController.followUser);

// Route hủy theo dõi
router.post('/unfollow/:userId', userController.unfollowUser);

// Route lấy danh sách theo dõi của 1 người dùng
router.get('/getfollowinfo/:userId', userController.getFollowInfoByID);

// Route lấy tài khoản theo id
router.get('/getuserbyid/:id', userController.getUserByID);

// Route lấy tài khoản đang đăng nhập 
router.get('/getuser', userController.getUser);

// Route Cập nhật Trạng thái Đọc
router.post('/updatebookstatus', userController.updateBookStatus);

// Route Cập nhật Trạng thái Đọc
router.put('/updateprofile/:userId', userController.updateProfileByUser);

// Route Lấy người dùng (có sách) theo ID
router.get('/getuser/:userId', userController.getUserWithRef);

// Route LẤY tất cả người dùng
router.get('/getallusers', userController.getAllUsers);

// Route lấy tên tài khoản
router.get('/getuserbyname/:name', userController.getUsersByName);

// Route LẤY danh người dùng đã xóa gần đây
router.get('/getallusersvaluezero', userController.getAllUsersValueZero);

// Route TÌM KIẾM người dùng theo tiêu đề / tác giả
router.get('/searchusers', userController.searchUsers);

// Route THÊM người dùng mới
router.post('/addusers', userController.createUser);

// Route CẬP NHẬT người dùng 
router.put('/updateuser/:id', userController.updateUser);

// Route THAY ĐỔI giá trị người dùng để đưa 1 người dùng vào đã xóa gần đây
router.put('/changevalueofusertodelete', userController.updateValue);

// Route THAY ĐỔI giá trị người dùng để đưa tất cả người dùng vào đã xóa gần đây
router.put('/changevalueofalluserstodelete', userController.updateAllValue);

// Route THAY ĐỔI giá trị người dùng để khôi phục 1 người dùng
router.put('/changevalueofusertorestore', userController.updateValue);

// Route THAY ĐỔI giá trị người dùng để khôi phục tất cả người dùng
router.put('/changevalueofalluserstorestore', userController.updateAllValue);

// Route XÓA người dùng được chọn
router.delete('/deleteuser/:id', userController.deleteUser);

// Route XÓA tất cả người dùng trong đã xóa gần đây
router.delete('/deleteallusers', userController.deleteUsersWithValueZero);

module.exports = router;
