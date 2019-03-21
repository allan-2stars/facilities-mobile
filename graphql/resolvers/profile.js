const User = require('../../models/user');
const Profile = require('../../models/profile');

module.exports = {
  // must be same name as type RootQuery name
  // GET
  users: () => {
    return User.find()
      .then(users => {
        return users.map(user => {
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
  profilesPeek: (args, req) => {
    // authentication first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    // check if the request user is in manager role
    return User.findById(req.userId)
      .then(user => {
        return Profile.findOne({ user: req.userId });
      })
      .then(profile => {
        const allowedRoles = ['Teacher', 'Manager'];
        let allowePeeking = false;
        // check if there is a matched role, if find one
        // set allowePeeking to true
        allowedRoles.map(role => {
          if (role === profile.role) allowePeeking = true;
        });
        // check if current request user has authorize to peek profile.
        // if not throw error
        if (!allowePeeking) {
          throw new Error('Not Authorized for peeking profile.');
        }

        // if has authorize, get profile by user id
        return Profile.find();
      })
      .then(profiles => {
        return profiles.map(profile => {
          return {
            ...profile._doc,
            _id: profile.id
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },

  // get profile by user ID
  // GET
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
  // POST
  createProfile: (args, req) => {
    // authentication first
    if (!req.isAuth) {
      throw new Error('Not Authenticated!');
    }
    const {
      firstName,
      lastName,
      jobTitle,
      contact,
      role,
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
      user: req.userId,
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle ? jobTitle : '',
      contact: contact,
      role: role,
      emergencyContact: emergencyContact ? emergencyContactq : '',
      relationship: relationship ? relationship : '',
      gender: gender,
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
