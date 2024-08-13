const express = require('express');
const router = express.Router();
const {
    getUsers,
    updateManyUsersSameData,
    updateManyUsersDifferentData,
    checkAccess,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const {
    validateUpdateManyUsersSameData,
    validateUpdateManyUsersDifferentData,
    validateCheckAccess,
    validateUpdateUser
} = require('../middlewares/validation');

router.get('/', protect, getUsers);
router.patch('/update-many-same', protect, validateUpdateManyUsersSameData, updateManyUsersSameData);
router.patch('/update-many-different', protect, validateUpdateManyUsersDifferentData, updateManyUsersDifferentData);
router.post('/check-access', protect, validateCheckAccess, checkAccess);
router.patch('/:id', protect, validateUpdateUser, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
