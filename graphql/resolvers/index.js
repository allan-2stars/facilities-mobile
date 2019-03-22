const authResolver = require('./auth');
const profileResolver = require('./profile');
const courseResolver = require('./course');
const assignedResolver = require('./assigned');

const rootResolver = {
  ...authResolver,
  ...profileResolver,
  ...courseResolver,
  ...assignedResolver
};

module.exports = rootResolver;
