import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    friends: [{
        friendId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Bill = mongoose.model('Bill', BillSchema);

export default Bill
