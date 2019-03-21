const authResolver = require('./auth');
const profileResolver = require('./profile');
const courseResolver = require('./course');

const rootResolver = {
  ...authResolver,
  ...profileResolver,
  ...courseResolver
};

module.exports = rootResolver;
