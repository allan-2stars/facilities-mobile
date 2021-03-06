const User = require('../../models/user');
const Course = require('../../models/course');
const allowOperate = require('../../helpers/allowOperation');

module.exports = {
  // Show all courses
  // Get course by
  // create course, just create, no amend
  // Mutation
  createCourse: (args, req) => {
    // authentication first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    return User.findOne({ user: req.userId })
      .then(user => {
        if (!user) {
          throw new Error('No user exists, no authorized to create course!');
        }
        // check if current request user has authorize to create course.
        const allowedCreate = allowOperate(user.role, 'Manager');
        // if not throw error
        if (!allowedCreate) {
          throw new Error('Not Authorized for creating course.');
        }

        const {
          tutor,
          title,
          difficulty,
          description,
          moreInfo
        } = args.courseInput;
        // then create course
        //
        // course info
        const courseData = {
          tutor,
          title,
          difficulty: difficulty ? difficulty : '',
          description,
          moreInfo: moreInfo ? moreInfo : ''
        };

        return new Course(courseData)
          .save()
          .then(course => {
            return {
              ...course._doc,
              _id: course.id
            };
          })
          .catch(err => {
            console.log('errors', err);
            throw err;
          });
      })
      .catch(err => {
        console.log('errors', err);
        throw err;
      });
  }
};
