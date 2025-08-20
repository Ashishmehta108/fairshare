const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route   GET api/users/me
// @desc    Get user profile
// @access  Private
router.get('/me', auth, userController.getUserProfile);

// @route   POST api/users/friends
// @desc    Add a friend
// @access  Private
router.post(
  '/friends',
  [
    auth,
    [
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  userController.addFriend
);

// @route   DELETE api/users/friends/:friendId
// @desc    Remove a friend
// @access  Private
router.delete('/friends/:friendId', auth, userController.removeFriend);

module.exports = router;
