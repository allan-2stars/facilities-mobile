const User = require('../../models/user');
const Profile = require('../../models/profile');
const allowOperate = require('../../helpers/allowOperation');

module.exports = {
  // must be same name as type RootQuery name
  // Query
  users: () => {
    return User.find()
      .then(users => {
        return users.map(user => {
          //console.log(user._doc);
          return {
            ...user._doc
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },

  // peek Profiles List only allowed for specific role
  // Query
  profilesPeek: (args, req) => {
    // authentication first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    // user logged in, so no need to check if user exists
    return User.findById(req.userId)

      .then(user => {
        if (!user) {
          throw new Error('No User exists, no authorized to peek!');
        }

        // check if current request user has authorize to peek profile.
        const allowedPeek = allowOperate(user.role, ['Tutor', 'Manager']);
        // if not throw error
        if (!allowedPeek) {
          throw new Error('Not Authorized for peeking profiles.');
        }
        return Profile.find().populate('user', ['-password']);
      })
      .then(profiles => {
        return profiles.map(res => {
          return {
            ...res._doc,
            _id: res.id
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },

  // get profile by user ID
  // Query
  profile: (args, req) => {
    // authentication first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    return Profile.findOne({ user: req.userId })
      .populate('user', ['-password'])
      .then(profile => {
        if (!profile) {
          throw new Error('Profile Not found.');
        }
        return {
          ...profile._doc,
          _id: profile.id
        };
      })
      .catch(err => {
        throw err;
      });
  },

  // create Profile
  // Mutation
  createProfile: (args, req) => {
    // authentication first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    // TODO: Only Manager can add/change role
    const {
      courses,
      staff,
      students,
      jobTitle,
      contact,
      firstName,
      lastName,
      emergencyContact,
      relationship,
      gender,
      grade,
      className,
      charactor,
      moreInfo
    } = args.profileInput;
    // then create profile
    //
    // profile info
    const profileData = {
      courses,
      staff,
      students,
      user: req.userId,
      jobTitle: jobTitle ? jobTitle : '',
      contact,
      firstName,
      lastName,
      emergencyContact: emergencyContact ? emergencyContactq : '',
      relationship: relationship ? relationship : '',
      gender,
      grade: grade ? grade : '',
      class: className ? className : '',
      charactor: charactor ? charactor : '',
      moreInfo: moreInfo ? moreInfo : ''
    };

    return Profile.findOne({ user: req.userId })
      .then(profile => {
        // if profile exists, amend
        if (profile) {
          return Profile.findOneAndUpdate(
            {
              user: req.userId
            },
            {
              $set: profileData
            },
            {
              new: true
            }
          )
            .then(profile => {
              //console.log('profile updated now');
              return {
                ...profile._doc,
                _id: profile.id
              };
            })
            .catch(err => {
              throw err;
            });
        }
        // if no existing profile, then create new one
        else {
          return new Profile(profileData)
            .save()
            .then(profile => {
              //console.log('new profile saved now');
              return {
                ...profile._doc,
                _id: profile.id
              };
            })
            .catch(err => {
              console.log('errors', err);
              throw err;
            });
        }
      })
      .catch(err => {
        console.log('errors', err);
        throw err;
      });
  }
};
