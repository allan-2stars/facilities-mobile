const CourseAssigning = require('../../models/courseAssigning');
const Course = require('../../models/course');

module.exports = {
  // use async function
  courseAssigning: async (args, req) => {
    // do the authention first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    try {
      const assignings = await CourseAssigning.find()
        .populate('course')
        .populate('user', ['-password']);
      return assignings.map(assigning => {
        return {
          ...assigning._doc
        };
      });
    } catch (err) {
      throw err;
    }
  },

  // assign the course
  assignCourse: async (args, req) => {
    // do the authention first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    //TODO: Check if the course already assigned to the same user
    //
    //

    const fetchedCourse = await Course.findOne({ _id: args.courseId }).populate(
      'staff',
      ['-password']
    );
    const courseAssigning = new CourseAssigning({
      // only now assign to request user
      // TODO: can assigned to any user, managed by manager
      user: req.userId,
      course: fetchedCourse
    });
    const result = await courseAssigning.save();
    return {
      ...result._doc
    };
  }
};
