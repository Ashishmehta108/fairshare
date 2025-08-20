const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('friends', ['name', 'email']);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Add a friend
// @route   POST /api/users/friends
// @access  Private
exports.addFriend = async (req, res) => {
    try {
        const { email } = req.body;

        // Find friend by email
        const friend = await User.findOne({ email }).select('-password');
        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already friends
        const user = await User.findById(req.user.id);
        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'User is already a friend' });
        }

        // Add friend
        user.friends.push(friend._id);
        await user.save();

        res.json({ message: 'Friend added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Remove a friend
// @route   DELETE /api/users/friends/:friendId
// @access  Private
exports.removeFriend = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Remove friend
        user.friends = user.friends.filter(
            friendId => friendId.toString() !== req.params.friendId
        );
        
        await user.save();
        res.json({ message: 'Friend removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
