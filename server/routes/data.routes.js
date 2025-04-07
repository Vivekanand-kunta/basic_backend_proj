const express = require('express');
const router = express.Router();
const Data = require('../models/data.model');

router.post('/', async (req, res) => {
    const { name, temp, ppm, comfort } = req.body;
    const newData = new Data({ name, temp, ppm, comfort });
    try {
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/:id', async (req, res) => {
    const { name, temp, ppm, comfort } = req.body;
    try {
        const data = await Data.findByIdAndUpdate(
            req.params.id, 
            { name, temp, ppm, comfort }, 
            { new: true, runValidators: true }
        );
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const data = await Data.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;