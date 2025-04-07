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
        const savedData = await newData.save({ timeout: 30000 }); // Set save timeout to 30 seconds
        res.status(201).json(savedData);
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ error: err.message.includes('timed out') ? 'Operation timed out' : err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await Data.find()
            .limit(50) // Restrict to 50 items to improve performance
            .sort({ createdAt: -1 }) // Sort by most recent
            .setOptions({ maxTimeMS: 10000 }); // Query timeout of 10 seconds
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message.includes('timed out') ? 'Query timed out' : err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id)
            .setOptions({ maxTimeMS: 10000 }); // Query timeout of 10 seconds
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
        return res.status(400).json({ error: 'Missing required fields (name, temp, ppm, comfort)' });
    }
    try {
        const data = await Data.findByIdAndUpdate(
            req.params.id,
            { name, temp, ppm, comfort },
            { new: true, runValidators: true, timeout: 30000 } // Update timeout to 30 seconds
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
        const data = await Data.findByIdAndDelete(req.params.id)
            .setOptions({ maxTimeMS: 10000 }); // Query timeout of 10 seconds
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;