const mongoose = require('mongoose');

const uri = "mongodb+srv://vivekanandreddy:P0lRGWxRdThxB9Nz@backendproject.tacxulh.mongodb.net/?retryWrites=true&w=majority&appName=Backend";

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});