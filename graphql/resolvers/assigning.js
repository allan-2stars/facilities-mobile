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
        .populate('tutor', ['-password']);
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
    const { tutorId, courseId } = args.courseAssigningInput;
    try {
      const fetchedCourse = await Course.findOne({
        _id: courseId
      });
      const fetchedAssigned = await CourseAssigning.findOne({
        tutor: tutorId,
        course: courseId
      });
      // check if course and tutor match, then
      // throw error, course already assigned.
      if (fetchedAssigned) {
        throw new Error('Already assigned to the tutor.');
      }

      // if the course already assigned to any tutor
      // then use this to update tutor
      // front end need to validate/confirm to real update.
      const fetchedCourseExist = await CourseAssigning.findOne({
        course: courseId
      });
      let courseAssigning;

      if (fetchedCourseExist) {
        // change the tutorId
        courseAssigning = fetchedCourseExist.set({
          tutor: tutorId,
          course: fetchedCourse
        });
        const result = await courseAssigning.save();
        return {
          ...result._doc
        };
        //throw new Error('Course already assigned to someone');
      }
      // if course has not been assigned to anyone
      // assign it.
      else {
        courseAssigning = new CourseAssigning({
          // only now assign to request user
          // TODO: currently only can assign to current request user
          // need ability to assigne to any user, managed by manager
          tutor: tutorId,
          course: fetchedCourse
        });
        const result = await courseAssigning.save();
        return {
          ...result._doc
        };
      }
    } catch (err) {
      throw err;
    }
  }
};
