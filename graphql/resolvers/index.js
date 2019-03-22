const authResolver = require('./auth');
const profileResolver = require('./profile');
const courseResolver = require('./course');
const assigningResolver = require('./assigning');

const rootResolver = {
  ...authResolver,
  ...profileResolver,
  ...courseResolver,
  ...assigningResolver
};

module.exports = rootResolver;
