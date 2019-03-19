const express = require('express');
const mongoose = require('mongoose');

const app = express();

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
