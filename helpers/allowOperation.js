// helper functions

// crieria can be Array or String
const allowOperate = (valueToCheck, criteria) => {
  // check if there is a match, if find one, reture true
  let allowed = false;
  // check if type of criteria is Array
  if (Array.isArray(criteria)) {
    criteria.map(c => {
      if (c === valueToCheck) allowed = true;
    });
  }
  // also accept criteria as type of String
  else if (criteria.constructor === String) {
    if (criteria === valueToCheck) allowed = true;
  } else {
    allowed = false;
  }
  return allowed;
};

module.exports = allowOperate;
