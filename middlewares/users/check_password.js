/**
 * @file check_password.js
 * @namespace Check user password
 */

var rek = require('rekuire');
var Account = rek('data/models/user/account');
var crypto = require('crypto');

/**
 * @desc  Method to check if the password is correct
 * @param object $password - Password to check
 * @return object - Success true or false
 */
function checkPassword(req, res, next) {
    Account.findOne({_id: req.user._id})
        .exec(function(err, user) {
            if (err) res.send(err);
            if (user && req.body.password) {
                crypto.pbkdf2(req.body.password, user.salt, 25000, 512, function(err, hashRaw) {
                    if (err) {
                        res.send(err);
                    }
                    
                    var hash = new Buffer(hashRaw, 'binary').toString('hex');

                    if (hash === user.hash) {
                        res.send({success: true});
                    } else {
                        res.send({success: false});
                    }
                });
            } else {
                res.send({err: 'no user'});
            }
        });
}

module.exports = checkPassword;