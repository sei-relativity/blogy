// Require necessary NPM Packages
const express = require('express');
const mongoose = require('mongoose');

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

/*** Routes ***/

// Mount imported Routers
app.use(indexRouter);
app.use(articlesRouter);

// Start the server to listen for requests on a given port
app.listen(port, () => {
  console.log(`blogy is listening on port ${port}`);
});