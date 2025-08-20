const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const billController = require('../controllers/billController');

// @route   POST api/bills
// @desc    Create a new bill
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('totalAmount', 'Total amount is required').isNumeric(),
      check('friends', 'Friends array is required').isArray({ min: 1 })
    ]
  ],
  billController.createBill
);

// @route   GET api/bills
// @desc    Get all bills for the logged-in user
// @access  Private
router.get('/', auth, billController.getBills);

// @route   PATCH api/bills/:id
// @desc    Update bill payment status
// @access  Private
router.patch(
  '/:id',
  [
    auth,
    [
      check('friendId', 'Friend ID is required').not().isEmpty(),
      check('status', 'Status is required and must be either "paid" or "pending"')
        .isIn(['paid', 'pending'])
    ]
  ],
  billController.updateBillStatus
);

module.exports = router;
