
/**
 * Passport strategies
 */

var rek = require('rekuire');
var passport = require("passport");
var Account = rek('data/models/user/account');

module.exports = function(strategy) {
    passport.use(new strategy(Account.authenticate()));
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());
};

// module.exports = function(strategy) {
//     passport.use(new strategy(
//         function(username, password, done) {
//             User.findOne({ username: username }, function(err, user) {
//                 if (err) { return done(err); }
//                 if (!user) {
//                     return done(null, false, { message: 'Incorrect username.' });
//                 }
//                 if (!user.validPassword(password)) {
//                     return done(null, false, { message: 'Incorrect password.' });
//                 }
//                 return done(null, user);
//             });
//         }
//     ));
// };