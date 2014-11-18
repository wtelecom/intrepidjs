var rek = require('rekuire');
var mongoose = require('mongoose');
var Account = rek('data/models/user/account');
var LocalStrategy = require("passport-local").Strategy;

module.exports = function(app, passport) {

    passport.use(new LocalStrategy(function(username, password, done) {
        Account.findOne({ "$or": [{username: username }, {email: username}]}, function (err, user) {
            if (err) { return done(err) }
            if (!user) {
              return done(null, false, { message: 'Unknown user' })
            }
            //user.isValidUserPassword(username, passport, function(done) {
            user.authenticate(password, function(result) {
              console.log("User authed:", result);
              if (result==false) return done(null, false, { message: 'Invalid password' })
              return done(null, user);
            });

          });
      })
    );

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

}
