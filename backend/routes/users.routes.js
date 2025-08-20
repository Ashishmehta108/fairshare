
import { check } from 'express-validator';
import { getUserProfile, addFriend, removeFriend } from '../controllers/user.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';
const userRouter = Router();
// @route   GET api/users/me
// @desc    Get user profile
// @access  Private 
userRouter.get('/me', auth, getUserProfile);

// @route   POST api/users/friends
// @desc    Add a friend
// @access  Private
userRouter.post(
  '/friends',
  [
    auth,
    [
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  addFriend
);

// @route   DELETE api/users/friends/:friendId
// @desc    Remove a friend
// @access  Private
userRouter.delete('/friends/:friendId', auth, removeFriend);

export default userRouter;
