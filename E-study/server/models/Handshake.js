const mongoose = require('mongoose');

const handshakeSchema = new mongoose.Schema({
    learnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// To ensure a learner doesn't send multiple pending requests to the same trainer
handshakeSchema.index({ learnerId: 1, trainerId: 1 }, { unique: true });

module.exports = mongoose.model('Handshake', handshakeSchema);
