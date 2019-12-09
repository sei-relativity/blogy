// Require necessary NPM Packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Require AUth Related Packages
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Require Passport Strategy and Options
const strategy = require('./app/lib/passportStrategy');
const jwtOptions = require('./app/lib/passportOptions');


const saltRounds = 10;


// Define our auth strategy from before
passport.use(strategy);

// Require Route Files
const indexRouter = require('./app/routes/index');
const articlesRouter = require('./app/routes/articles');

// Require DB Configuration File
const db = require('./config/db');

// Establish Database Connection
mongoose.connect(db, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('Connected to Mongo');
})

// Instantiate Express Application Object
const app = express();

// Define PORT for the API to run on
const port = process.env.PORT || 5000;
const reactPort = 3000;

/*** Middleware ***/

// Add `bodyParser` middleware which will parse JSON requests into
// JS objects before they reach the route files.
//
// The method `.use` sets up middleware for the Express application
app.use(express.json());

// Set CORS headers on response from this API using the `cors` NPM package
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${reactPort}` }));

/*** Routes ***/

// Mount imported Routers
app.use(indexRouter);
app.use(articlesRouter);

app.get('/test', function(req, res) {
  bcrypt.hash('1234', saltRounds, function(error, hash) {
    res.status(200).json({ password: hash });
  });
});

// Dummy User for Testing ONLY!!!
const dummyUser = {
  id: 42,
  username: 'usman',
  password: '1234',
};

app.post('/api/login', function(req, res) {
  if (req.body.username && req.body.password) {
    // This should be a Database call.
    if (req.body.username === dummyUser.username && req.body.password === dummyUser.password) {
      // Select the information we want to send to the user.
      const payload = { id: dummyUser.id };

      // Build a JWT Token using the payload.
      const token = jwt.sign(
                          payload,
                          jwtOptions.secretOrKey,
                          { expiresIn: 300 }); // 5 minutes

      // Send the JWT Token to the user.
      res.status(200).json({ success: true, token: token });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } else {
    res.status(400).json({ error: 'Username & Password Required' });
  }
});

app.get('/api/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.status(200).json({
    message: 'Hey, you can only see this message with the JWT token.',
    user: req.user
  })
});

// Start the server to listen for requests on a given port
app.listen(port, () => {
  console.log(`blogy is listening on port ${port}`);
});