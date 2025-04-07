const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    temp: {
        type: Number,
        required: true
    },
    ppm: {
        type: Number,
        required: true
    },
    comfort: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add compound index for frequent queries (e.g., filtering by temp, ppm, and sorting by createdAt)
dataSchema.index({ temp: 1, ppm: 1, createdAt: -1 });

// Optional: Add text index for name searches
dataSchema.index({ name: 'text' });

// Set buffer timeout to 30 seconds to match server connection settings
dataSchema.set('bufferTimeoutMS', 30000);

module.exports = mongoose.model('Data', dataSchema);