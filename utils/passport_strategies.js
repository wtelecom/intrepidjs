
/**
 * Passport strategies
 */

var rek = require('rekuire'),
    passport = require("passport"),
    Account = rek('data/models/user/account');

module.exports = function(local, basic, api) {
    passport.use(new local(Account.authenticate()));
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());

    passport.use(new basic(
        function(username, password, done) {
            Account.findOne({ username: username }, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                user.validPassword(user._id, password, function(result, userLogged) {
                    if (!result) {
                        return done(null, false);
                    } else {
                        return done(null, user.token);
                    }
                });
            });
        }
    ));

    passport.use(new api(
        function(apikey, done) {
            Account.findOne({ token: apikey }, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user);
            });
        }
    ));
};