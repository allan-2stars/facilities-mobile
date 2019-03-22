const User = require('../../models/user');
const Profile = require('../../models/profile');

// redis
//const redis = require('redis');
/// ------------------------------
///
/// ----- Redis Client Setup -----
///
///-------------------------------
// const client = redis.createClient(6379, 'localhost');
// client.on('connect', () => {
//   console.log('Redis client connected');
// });
// client.on('error', function(err) {
//   console.log('Something went wrong ' + err);
// });

//// TEST Redis below, comment after test
// client.set('my test key', 'my test value', redis.print);
// client.get('my test key', function(error, result) {
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   console.log('GET result ->' + result);
// });

/// ----- End of Radis -----
///-------------------------

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
    return Profile.findOne({ user: req.userId })

      .then(profile => {
        if (!profile) {
          throw new Error('No profile exists, no authorized to peek!');
        }
        const allowedRoles = ['Tutor', 'Manager'];
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
        return Profile.find().populate('user', ['-password']);

        // // TODO: add redis later
        //  // get cached data if exists
        //     // no Redis for now, add in later
        // client.get('profileList', (error, result) => {
        //   if (error) {
        //     console.log(error);
        //     throw error;
        //   }
        //   if (result) {

        //     //console.log('from cached data');
        //     return JSON.parse(result).map(res => {
        //       return {
        //         // data parsed from Redis, no _doc property
        //         ...res
        //       };
        //     });
        //   }
        //   // if no cache exists yet, access data from database
        //   // and set cache
        //   else {
        //     console.log('else');
        //     Profile.find().then(profiles => {
        //       console.log('from database');
        //       client.set('profileList', JSON.stringify(profiles));
        //       return profiles.map(res => {
        //         return {
        //           ...res._doc,
        //           _id: res.id
        //         };
        //       });
        //     });
        //   }
        // });
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
    const {
      courses,
      staff,
      students,
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
      courses,
      staff,
      students,
      user: req.userId,
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
