/**
 * @file authorization.js
 * @desc Has user authorization
 */

var _ = require('underscore');

/**
 * @desc Has user authorization
 * @return boolean - Has user authorization.
 */
function hasAuthorization(model) {
    return function prePerms(req, res, next) {
        var isAuthor = function(uid) {
            return String(uid) === String(req.user._id);
        };
        var isAdmin = function() {
            return _.contains(req.user.roles, 'admin');
        };
        if (req.user) {
            if (req.params.id) {
                model.findById(req.params.id)
                    .exec(function(err, obj) {
                        if (!err && obj) {
                            if (isAuthor(obj.author) || isAdmin()) {
                                next();
                            } else {
                                res.json({ response: false });
                            }
                        } else {
                            res.json({ response: false });
                        }
                    });
            } else {
                next();
            }
        } else {
            res.json({ response: false });
        }
    };
}

module.exports = hasAuthorization;

