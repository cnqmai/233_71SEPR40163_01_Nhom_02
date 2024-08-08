const express = require('express');
const router = express.Router();
const path = require('path');
const groupController = require('../controllers/groupController');

// USER
// Route Lấy 1 Nhóm có bài đăng
router.get('/getgroupwithposts/:userId/:groupName', groupController.getGroupWithPosts);

// Route Lấy Nhiều Nhóm có bài đăng
router.get('/getgroupswithposts/:userId', groupController.getGroupsWithPosts);

// Route lấy 1 nhóm có danh sách thành viên
router.get('/getgroupwithusers/:userId/:groupName', groupController.getGroupWithUsers);

// Route lấy nhóm do người dùng quản lí
router.get('/getmanagegroups/:userId/:groupName', groupController.getManageGroups);

// Route lấy nhóm người dùng tham gia
router.get('/getjoinedgroups/:userId/:groupName', groupController.getJoinedGroups);

// Route lấy nhóm mà người dùng chưa tham gia
router.get('/getsuggestgroups/:userId/:groupName', groupController.getSuggestGroups);

// Route tạo nhóm của người dùng
router.post('/usercreategroup/:userId', groupController.createGroupByUser);

// Route tham gia nhóm
router.post('/join', groupController.joinGroup);

// Route RỜI nhóm
router.post('/leave', groupController.leaveGroup);

// ADMIN
// Route LẤY tất cả nhóm
router.get('/getallgroups', groupController.getAllGroups);

// Route LẤY danh nhóm đã xóa gần đây
router.get('/getallgroupsvaluezero', groupController.getAllGroupsValueZero);

// Route TÌM KIẾM nhóm theo tiêu đề / tác giả
router.get('/searchgroups', groupController.searchGroups);

// Route THÊM nhóm mới
router.post('/addgroups', groupController.createGroup);

// Route CẬP NHẬT nhóm 
router.put('/updategroup/:id', groupController.updateGroup);

// Route THAY ĐỔI giá trị nhóm để đưa 1 nhóm vào đã xóa gần đây
router.put('/changevalueofgrouptodelete', groupController.updateValue);

// Route THAY ĐỔI giá trị nhóm để đưa tất cả nhóm vào đã xóa gần đây
router.put('/changevalueofallgroupstodelete', groupController.updateAllValue);

// Route THAY ĐỔI giá trị nhóm để khôi phục 1 nhóm
router.put('/changevalueofgrouptorestore', groupController.updateValue);

// Route THAY ĐỔI giá trị nhóm để khôi phục tất cả nhóm
router.put('/changevalueofallgroupstorestore', groupController.updateAllValue);

// Route XÓA nhóm được chọn
router.delete('/deletegroup/:id', groupController.deleteGroup);

// Route XÓA tất cả nhóm trong đã xóa gần đây
router.delete('/deleteallgroups', groupController.deleteGroupsWithValueZero);

module.exports = router;
