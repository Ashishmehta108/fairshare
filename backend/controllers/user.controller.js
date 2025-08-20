import User from "../models/User.model.js";
export const getUserProfile = async (req, res) => {
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

export const addFriend = async (req, res) => {
    try {
        const { email } = req.body;
        const friend = await User.findOne({ email }).select('-password');
        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = await User.findById(req.user.id);
        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'User is already a friend' });
        }

        user.friends.push(friend._id);
        await user.save();

        res.json({ message: 'Friend added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const removeFriend = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
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
