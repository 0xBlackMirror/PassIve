// Basic Requires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const config = require('./config/database');
const userRoutes = require('./routes/user');
// Express App
const app = express();
// Public Folder
app.use(express.static(path.join(__dirname, 'public')));
// Database connection
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected successfully to the database.');
});
// Cors Middleware
app.use(cors());
// bodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
// Express Session Middleware
app.use(session({
    secret: config.database,
    resave: true,
    saveUninitialized: false
  }));
// Routes
app.use('/user', userRoutes);
// Test
app.get('/', (req, res) => {
    res.send('Working');
});
// Server Start
app.listen(3000, () => {
    console.log('Listening on port 3000.');
});