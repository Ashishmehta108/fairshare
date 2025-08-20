const Bill = require('../models/Bill');

// @desc    Create a new bill
// @route   POST /api/bills
// @access  Private
exports.createBill = async (req, res) => {
    try {
        const { image, totalAmount, friends } = req.body;

        const newBill = new Bill({
            userId: req.user.id,
            image,
            totalAmount,
            friends: friends.map(friend => ({
                friendId: friend.friendId,
                amount: friend.amount,
                status: 'pending'
            }))
        });

        const bill = await newBill.save();
        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all bills for a user
// @route   GET /api/bills
// @access  Private
exports.getBills = async (req, res) => {
    try {
        const bills = await Bill.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(bills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update bill payment status
// @route   PATCH /api/bills/:id
// @access  Private
exports.updateBillStatus = async (req, res) => {
    try {
        const { friendId, status } = req.body;
        
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Check if user is authorized
        if (bill.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Update friend's payment status
        const friendIndex = bill.friends.findIndex(
            f => f.friendId.toString() === friendId
        );

        if (friendIndex === -1) {
            return res.status(404).json({ message: 'Friend not found in this bill' });
        }

        bill.friends[friendIndex].status = status;
        await bill.save();

        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
