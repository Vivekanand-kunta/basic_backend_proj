const express = require('express');
const router = express.Router();
const Data = require('../models/data.model');

router.post('/', async (req, res) => {
    const { name, temp, ppm, comfort } = req.body;
    if (!name || !temp || !ppm || !comfort) {
        return res.status(400).json({ error: 'Missing required fields (name, temp, ppm, comfort)' });
    }
    const newData = new Data({ name, temp, ppm, comfort });
    try {
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        // Limit results and add timeout option
        const data = await Data.find()
            .limit(100) // Restrict to 100 items
            .sort({ createdAt: -1 }) // Sort by recent
            .setOptions({ maxTimeMS: 5000 }); // Set query timeout to 5 seconds
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message.includes('timed out') ? 'Query timed out' : err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        console.error('Error fetching data by ID:', err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { name, temp, ppm, comfort } = req.body;
    if (!name || !temp || !ppm || !comfort) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const data = await Data.findByIdAndUpdate(
            req.params.id,
            { name, temp, ppm, comfort },
            { new: true, runValidators: true }
        );
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const data = await Data.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;