const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  staff: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  moreInfo: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Course', courseSchema);
