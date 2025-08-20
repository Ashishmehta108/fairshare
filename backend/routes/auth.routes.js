
import { check } from 'express-validator';
import { signup, login, getUser } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';
const authRouter = Router();
// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
authRouter.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  signup
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
authRouter.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
authRouter.get('/', auth, getUser);

export default authRouter;
