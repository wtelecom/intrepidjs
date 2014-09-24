
/**
 * Get an user from mongoDB
 */

var userModel = require('../../data/models/user/account');

function loadUser(req, res, next) {
    if (req.params && req.params.name) {
        userModel.findOne({username: req.params.name}, function(err, user) {
            if (err) {
                return res.send(err);
            }
            req.user = user;
            next();
        });
    }
}

module.exports = loadUser;