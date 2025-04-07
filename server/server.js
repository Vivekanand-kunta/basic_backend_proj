const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); 

const uri = "mongodb+srv://vivekanandreddy:P0lRGWxRdThxB9Nz@backendproject.tacxulh.mongodb.net/?retryWrites=true&w=majority&appName=Backend";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000,
    socketTimeoutMS: 60000, 
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Initial connection error:', err));

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

const dataRoutes = require('./routes/data.routes');
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/project/index.html'));
});

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/project/data.html'));
});

app.get('/data/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/project/data-detail.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});