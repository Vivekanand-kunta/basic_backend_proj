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

dataSchema.index({ temp: 1, ppm: 1, createdAt: -1 });

dataSchema.index({ name: 'text' });

dataSchema.set('bufferTimeoutMS', 60000);

module.exports = mongoose.model('Data', dataSchema);