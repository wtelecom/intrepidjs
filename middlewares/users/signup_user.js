/**
 * @file signup_user.js
 * @namespace Signup User
 * @desc Signup logic strategy
 */

var passport = require("passport"),
    rek = require('rekuire'),
    uuid = require('node-uuid'),
    eventController = rek('utils/event_manager'),
    Account = rek('data/models/user/account');

/**
 * @desc  Method to singup an user in the system
 * @param object $data - Data after validation process
 * @return object - Sanitized data
 */
function signupUser(req, res) {
    Account.count({}, function (err, count) {
        var roles = [];

        if (count === 0) {
            roles.push('admin');
        }

        var newAccount = new Account({
          username: req.body.username,
          email: req.body.email,
          token: uuid.v4(),
          roles: roles,
          password: req.body.password

        });

        newAccount.save(function(err, response) {
          passport.authenticate('local')(req, res, function() {
            res.redirect('/');
          })
        });

        eventController.emit('user-created', newAccount);
        // Account.register(
        //     new Account(
        //         {
        //             username: req.body.username,
        //             email: req.body.email,
        //             token: uuid.v4(),
        //             roles: roles
        //         }
        //     ),
        //     req.body.password,
        //     function(err, account) {
        //         if (err) {
        //             console.log(err);
        //         }
        //
        //         passport.authenticate('local')(req, res, function() {
        //             res.redirect('/');
        //         });
        //     }
        // );
    });
}

module.exports = signupUser;
