const User = require('../../models/user');
const Profile = require('../../models/profile');
const Course = require('../../models/course');

module.exports = {
  // create course, just create, no amend
  // Mutation
  createCourse: (args, req) => {
    // authentication first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    return Profile.findOne({ user: req.userId })
      .then(profile => {
        if (!profile) {
          throw new Error('No profile exists, no authorized to create course!');
        }
        const allowedRoles = ['Manager'];
        let allowCreate = false;
        // check if there is a matched role, if find one
        // set allowCreate to true
        allowedRoles.map(role => {
          if (role === profile.role) allowCreate = true;
        });
        // check if current request user has authorize to peek profile.
        // if not throw error
        if (!allowCreate) {
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
