/**
 * Accounts routes.
 */

var passport = require("passport");
var rek = require('rekuire');
var signupPassport = rek('middlewares/users/signup_user');
//var passport_strategies = rek('utils/passport_strategies')

module.exports = {
    '/accounts/signup': [
        {
            methods: ['get'],
            fn: function(req, res, next) {
                res.render('accounts/signup');
            }
        },
        {
            methods: ['post'],
            fn: function(req, res, next) {
                signupPassport(req, res);
            }
        }
    ],

    '/accounts/login': [
        {
            methods: ['get'],
            fn: function(req, res, next) {
                res.render('accounts/login');
            }
        },
        {
            methods: ['post'],
            middleware: [passport.authenticate('local')],
            fn: function(req, res, next) {
              console.log(":(())");
              if (req.user) {
                return res.status(200).send({success:true});
              }
              res.status(500).send({success:false});

            }

        }
    ],

    '/accounts/logout': [
        {
            methods: ['get'],
            fn: function(req, res, next) {
                req.logout();
                res.send({success: true});
            }
        }
    ]
};
