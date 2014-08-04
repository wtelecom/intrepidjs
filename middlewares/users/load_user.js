
/**
 * Get an user from mongoDB
 */

var userModel = require('../../../data/models/core/users/user');

function loadUser(req, res, next) {
    userModel.findOne({username: req.params.name}, function(err, user) {
        if (err) {
            return next(err);
        }
        if (! user) {
            return res.send('Not found', 404);
        }
        req.user = user;
        next();
    });
}

module.exports = loadUser;