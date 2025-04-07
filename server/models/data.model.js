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

module.exports = mongoose.model('Data', dataSchema);