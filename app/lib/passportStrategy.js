// Passport Package
const passportJWT = require('passport-jwt');

// Passport Options
const jwtOptions = require('./passportOptions');

// JSON Web Token Strategy object that we will be using.
const JwtStrategy = passportJWT.Strategy;

// Dummy User for Testing ONLY!!!
const dummyUser = {
  id: 42,
  username: 'usman',
  password: '1234',
};

// The function where we are going to see if the requesting user
// has a valid JWT token or not. And, to see if it expired.
const strategy = new JwtStrategy(jwtOptions, function(jwtPayLoad, next) {
  console.log('Payload Received!');
  console.log('User ID:', jwtPayLoad.id);
  console.log('Token Expires On:', jwtPayLoad.exp);

  if (dummyUser.id === jwtPayLoad.id) {
    // If ID is in the database, the let's run our original route.
    next(null, dummyUser);
  } else {
    // If ID does not match, skip our route and return a 401.
    next(null, false);
  }
});

module.exports = strategy;