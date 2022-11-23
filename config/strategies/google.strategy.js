const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../../models/user");
const bcrypt = require("bcrypt");

module.exports = function googleStrategy() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACKURL,
        passReqToCallback: true
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          return done(null, profile);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
