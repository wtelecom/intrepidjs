/**
 * @file update.js
 * @namespace Update User
 * @desc Update logic strategy
 */

var rek = require('rekuire');
var Account = rek('data/models/user/account');
var _ = require('underscore');


/**
 * @desc  Method to update an user
 * @return object - Updated user
 */
function update(req, res, next) {
    var isAdmin = req.user.roles.indexOf('admin')+1;
    var reqUser = req.body;
    
    Account.findById(req.body._id)
        .exec(function(err, user) {
            if (err) return res.send(err);
            else {
                if (!isAdmin) {
                    // Only admins can be modify "roles" property
                    reqUser = _.without(user, 'roles');
                }
                _.extend(user, reqUser);
                user.save();
                req.object = user;
                next();
            }
        });
}

module.exports = update;