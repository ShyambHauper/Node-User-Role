const express = require('express');
const router = express.Router();
const {
    createRole,
    getRoles,
    updateRole,
    deleteRole,
    updateAccessModules
} = require('../controllers/roleController');
const { protect } = require('../middlewares/authMiddleware');
const { validateCreateRole, validateUpdateRole, validateUpdateAccessModules } = require('../middlewares/validation');

router.post('/', validateCreateRole, createRole);
router.get('/', protect, getRoles);
router.patch('/:id', protect, validateUpdateRole, updateRole);
router.delete('/:id', protect, deleteRole);
router.patch('/modules/:id', protect, validateUpdateAccessModules, updateAccessModules);

module.exports = router;
