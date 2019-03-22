const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseAssigningSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  // Below, Schema Options by mongoose
  {
    // add "created at", "updated at" field
    // for every entry in database
    timestamps: true
  }
);

module.exports = mongoose.model('CourseAssigning', CourseAssigningSchema);
