const authResolver = require('./auth');
const profileResolver = require('./profile');

const rootResolver = {
  ...authResolver,
  ...profileResolver
};

module.exports = rootResolver;
