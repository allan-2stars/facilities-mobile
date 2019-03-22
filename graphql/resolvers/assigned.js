const CourseAssigned = require('../../models/courseAssigned');
const Course = require('../../models/course');
const Profile = require('../../models/profile');
const allowPeek = require('../../helpers/allowOperation');

module.exports = {
  // only show assigneds for this logged in user.
  coursesAssigned: async (args, req) => {
    // do the authention first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    try {
      const coursesAssigned = await CourseAssigned.find({ tutor: req.userId })
        .populate('course')
        .populate('tutor', ['-password']);
      return coursesAssigned.map(assigned => {
        return {
          ...assigned._doc
        };
      });
    } catch (err) {
      throw err;
    }
  },

  // show all assigned courses for logged in user whose role is Manager and above
  coursesAssignedPeek: async (args, req) => {
    // do the authention first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    const profile = await Profile.findOne({ user: req.userId });
    // helper function
    const allowed = allowPeek(profile.role, 'Manager');
    // check if current user has authorize to peek courses assigned status.
    // if not throw error
    if (!allowed) {
      throw new Error('Not Authorized for peeking course assigned status.');
    }
    try {
      const coursesAssigned = await CourseAssigned.find()
        .populate('course')
        .populate('tutor', ['-password']);
      return coursesAssigned.map(assigned => {
        return {
          ...assigned._doc
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
    // assigne to any user, managed by manager
    // get tutor id from input
    const { tutorId, courseId } = args.courseAssignedInput;
    try {
      // find if there is one entry already match the assigned request
      const fetchedAssigned = await CourseAssigned.findOne({
        tutor: tutorId,
        course: courseId
      });
      // check if course and tutor match, then
      // throw error, course already assigned.
      if (fetchedAssigned) {
        throw new Error('Already assigned to the tutor.');
      }
      // get course detail
      const fetchedCourse = await Course.findOne({
        _id: courseId
      });

      // if the course already assigned to any tutor
      // then use this to update tutor
      // front end need to validate/confirm to real update.
      const fetchedCourseExist = await CourseAssigned.findOne({
        course: courseId
      });
      let courseAssigned;
      // check if course exists, then
      // update to new tutor
      if (fetchedCourseExist) {
        // change the tutorId
        courseAssigned = fetchedCourseExist.set({
          tutor: tutorId,
          course: fetchedCourse
        });
        const result = await courseAssigned.save();
        return {
          ...result._doc
        };
      }
      // if course has not been assigned to anyone
      // assign it.
      else {
        courseAssigned = new CourseAssigned({
          tutor: tutorId,
          course: fetchedCourse
        });
        const result = await courseAssigned.save();
        return {
          ...result._doc
        };
      }
    } catch (err) {
      throw err;
    }
  }
};
