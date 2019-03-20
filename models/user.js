const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  // any contact number: mobile or landline number
  contact: {
    type: String,
    required: true
  },
  skype: {
    type: String,
    required: false
  },
  analysisLevel: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  moreInfo: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);
