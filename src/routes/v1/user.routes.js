const express = require('express');
const userController = require('../../controllers/userController');
const validate = require('../../middlewares/validate');
const { updateMeSchema } = require('../../validations/userValidation');
const { protect, restrictTo } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);

// Self-service (any authenticated user, own account only)
router.patch('/me/upgrade-plan', userController.upgradePlan);
router.get('/me/usage', userController.getUsage);
router.patch('/me', validate(updateMeSchema), userController.updateMe);
router.delete('/me', userController.deleteMe);

// Admin-only user management
router.get('/', restrictTo('admin'), userController.getAllUsers);
router.get('/:id', restrictTo('admin'), userController.getUserById);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router;