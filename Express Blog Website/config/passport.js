const LocalStrategy = require("passport-local").Strategy;
const Users = require("../models/user");
const { dbConnect } = require("../dbConnect");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      let query = { username: username };
      Users.findOne(query, (err, user) => {
        if (err) {
          console.log(err);
        }
        if (!user) {
          return done(null, false, { message: "No User Found" });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.log(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong password" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
