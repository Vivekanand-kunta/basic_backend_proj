const express = require('express');
const router = express.Router();
const Data = require('../models/data.model');

const validateFields = (req, res, next) => {
    const { name, temp, ppm, comfort } = req.body;
    if (!name || temp === undefined || ppm === undefined || !comfort) {
        return res.status(400).json({ error: 'Missing required fields (name, temp, ppm, comfort)' });
    }
    next();
};

router.post('/', validateFields, async (req, res) => {
    const { name, temp, ppm, comfort } = req.body;
    try {
        const newData = new Data({ name, temp, ppm, comfort });
        const savedData = await newData.save({ timeoutMs: 10000 }); 
        res.status(201).json(savedData);
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({
            error: err.name === 'MongoTimeoutError' ? 'Operation timed out' : err.message
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await Data.find()
            .limit(50)
            .sort({ createdAt: -1 })
            .maxTimeMS(10000);
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({
            error: err.name === 'MongoTimeoutError' ? 'Query timed out' : err.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id).maxTimeMS(10000); 
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        console.error('Error fetching data by ID:', err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', validateFields, async (req, res) => {
    const { name, temp, ppm, comfort } = req.body;
    try {
        const data = await Data.findByIdAndUpdate(
            req.params.id,
            { name, temp, ppm, comfort },
            { new: true, runValidators: true, timeoutMs: 10000 } 
        );
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const data = await Data.findByIdAndDelete(req.params.id).maxTimeMS(10000); // Adjusted to 10s
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;