const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

// middleware
const isAuth = require('./middleware/is-auth');
// import GraphQL
const graphqlHttp = require('express-graphql');
const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');

const app = express();

/// --------------------------
///
/// ---    Middlewares    ---
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

// set Headers for fixing problem of CORS policy
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
// use owned auth middleware
app.use(isAuth);

/// ------------------------------
/// ------------------------------

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,

    // set this true, you have the graphql tool in browser
    graphiql: true
  })
);
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
