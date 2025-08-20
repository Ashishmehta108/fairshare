import Bill from "../models/Bill.Model.js";
export const createBill = async (req, res) => {
    try {
        const { imageUrl, totalAmount, friends } = req.body;

        const newBill = new Bill({
            userId: req.user.id,
            imageUrl,
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


export const getBills = async (req, res) => {
    try {
        const bills = await Bill.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(bills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


export const updateBillStatus = async (req, res) => {
    try {
        const { friendId, status } = req.body;
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        if (bill.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
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
