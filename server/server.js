const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json());

app.use('/project', express.static(path.join(__dirname, '../public/project')));
app.use('/javascript', express.static(path.join(__dirname, '../public/javascript')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});