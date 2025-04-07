const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve all static files from public

// MongoDB Connection with supported options
const uri = "mongodb+srv://vivekanandreddy:P0lRGWxRdThxB9Nz@backendproject.tacxulh.mongodb.net/?retryWrites=true&w=majority&appName=Backend";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds to select server
    socketTimeoutMS: 45000, // 45 seconds for socket operations
    // Removed deprecated options: autoReconnect, reconnectTries, reconnectInterval, bufferMaxEntries
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Initial connection error:', err));

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

// Note: 'reconnected' event is not directly supported in newer drivers; use connection state monitoring if needed
// mongoose.connection.on('reconnected', () => {
//     console.log('MongoDB reconnected');
// });

const dataRoutes = require('./routes/data.routes');
app.use('/api/data', dataRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/project/index.html'));
});

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/project/data.html'));
});

app.get('/data/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/project/data-detail.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});