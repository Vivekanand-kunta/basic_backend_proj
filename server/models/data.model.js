const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    temp: {
        type: Number,
        required: true,
        min: -273.15,
        validate: {
            validator: Number.isFinite,
            message: 'Temperature must be a valid number'
        }
    },
    ppm: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isFinite,
            message: 'PPM must be a valid number'
        }
    },
    comfort: {
        type: String,
        required: true,
        enum: {
            values: ['low', 'medium', 'high', 'uncomfortable'],
            message: '{VALUE} is not a valid comfort level'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {

    timestamps: true,
    bufferTimeoutMS: 10000   
});

dataSchema.index({ temp: 1, ppm: 1, createdAt: -1 });

dataSchema.index({ name: 'text' });

dataSchema.virtual('isComfortable').get(function() {
    return this.comfort === 'high' || this.comfort === 'medium';
});

dataSchema.pre('save', function(next) {
    next();
});

module.exports = mongoose.model('Data', dataSchema);