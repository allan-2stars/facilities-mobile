const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  tutor: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  role: {
    // student, manager, tutor
    type: String,
    required: true
  },
  jobTitle: {
    // parent/supervisor/school members
    type: String,
    required: false // dynamic change as per role selected
  },
  contact: {
    // any contact number: mobile or landline number
    type: String,
    required: true
  },
  emergencyContact: {
    type: String,
    required: false
  },
  relationship: {
    // for parents, relationship with students
    type: String,
    required: false // dynamic change as per role selected
  },
  gender: {
    type: String,
    required: true
  },
  grade: {
    // which year of this student
    type: String,
    required: false // dynamic change as per role selected
  },
  class: {
    // which class of this student
    type: String,
    required: false // dynamic change as per role selected
  },
  charactor: {
    // describe the charactor of this student
    type: String,
    required: false
  },
  moreInfo: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Profile', profileSchema);
