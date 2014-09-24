/**
 * @file authorization.js
 * @desc Has user authorization
 */

var _ = require('underscore'),
    passport = require('passport');

/**
 * @desc Has user authorization
 * @return boolean - Has user authorization.
 */
function hasAuthorization(model) {
    return function(req, res, next) {
        if (req.query.apikey) {
            passport.authenticate('localapikey', function(err, user, info) {
                if (err) { return next(err); }
                if (!user) { return res.redirect('/login'); }

                if (user) {
                    if (model && !_.isUndefined(model.schema.paths.author) && !_.isEmpty(req.body)) {
                        req.body['author'] = user;
                    }

                    var isAuthor = function(uid) {
                        return String(uid) === String(user._id);
                    };

                    var isAdmin = function() {
                        return _.contains(user.roles, 'admin');
                    };

                    if (user) {
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
                }
            })(req, res, next);
        } else {
            var isAuthor = function(uid) {
                return String(uid) === String(req.user._id);
            };
            var isAdmin = function() {
                return _.contains(req.user.roles, 'admin');
            };
            if (req.user) {
                if (model && !_.isUndefined(model.schema.paths.author) && !_.isEmpty(req.body)) {
                    req.body['author'] = req.user;
                }
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
        }
    };
}

module.exports = hasAuthorization;

