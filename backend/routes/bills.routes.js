
import { check } from 'express-validator';
import { createBill, getBills, updateBillStatus } from '../controllers/bill.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';
const billRouter = Router();

// @route   POST api/bills
// @desc    Create a new bill
// @access  Private
billRouter.post(
  '/',
  [
    auth,
    [
      check('totalAmount', 'Total amount is required').isNumeric(),
      check('friends', 'Friends array is required').isArray({ min: 1 })
    ]
  ],
  createBill
);

// @route   GET api/bills
// @desc    Get all bills for the logged-in user
// @access  Private
billRouter.get('/', auth, getBills);

// @route   PATCH api/bills/:id
// @desc    Update bill payment status
// @access  Private
billRouter.patch(
  '/:id',
  [
    auth,
    [
      check('friendId', 'Friend ID is required').not().isEmpty(),
      check('status', 'Status is required and must be either "paid" or "pending"')
        .isIn(['paid', 'pending'])
    ]
  ],
  updateBillStatus
);

export default billRouter;
