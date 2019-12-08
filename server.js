// Require necessary NPM Packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// Start the server to listen for requests on a given port
app.listen(port, () => {
  console.log(`blogy is listening on port ${port}`);
});