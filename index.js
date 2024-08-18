const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Import routes
const shortenRoute = require('./routes/url');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for rendering the index page
app.get('/', (req, res) => {
    res.render('index', { shortenedUrl: null });
});

// Use the shorten route for handling URL shortening
app.use('/', shortenRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
