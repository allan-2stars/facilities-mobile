const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

/// --------------------------
///
/// ---    Middle Wares    ---
///
// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {
    flags: 'a'
  }
);

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// Body parser to parse front-end form body
// body name match the name of body.name
// add middleware here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/// ------------------------------
/// ------------------------------

app.get('/', function(req, res, next) {
  res.send('Testing!');
});

// DB config
const db = require('./config/keys').mongoURI;
const PORT = require('./config/keys').PORT || 8000;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected!');
  })
  .catch(err => console.log('database connect error: ', err));

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
