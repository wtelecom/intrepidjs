/**
 * @file change_password.js
 * @namespace Change user password
 */

var rek = require('rekuire');
var Account = rek('data/models/user/account');
var crypto = require('crypto');

/**
 * @desc  Method to change the password
 * @param string $password - Old password
 * @param string $newPass - New password
 * @param string $confirmationPass - Confirmation password
 * @return object - Success true or false
 */
function changePassword(req, res, next) {
    Account.validPassword(req.user._id, req.body.password, function(result, user) {
        if (result) {
            if (user && req.body.newPass) {
                crypto.randomBytes(32, function(err, buf) {
                    if (err) {
                        res.send(err);
                    }

                    var salt = buf.toString('hex');

                    crypto.pbkdf2(req.body.newPass, salt, 25000, 512, function(err, hashRaw) {
                        if (err) {
                            return cb(err);
                        }

                        user.hash = new Buffer(hashRaw, 'binary').toString('hex');
                        user.salt = salt;

                        user.save();

                        res.send({success: true});
                    });
                });
            } else {
                res.send({success: false});
            }
        } else {
            res.send({success: false});
        }
    });
}

module.exports = changePassword;