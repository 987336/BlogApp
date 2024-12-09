const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true, // Ensure userId is provided
    },
}, { timestamps: true });

module.exports = mongoose.model('UserImagesData', imageSchema);
