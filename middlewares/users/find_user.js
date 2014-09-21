
/**
 * Get an user from mongoDB
 */

var rek = require('rekuire'),
    userModel = rek('data/models/user/account');

function loadUser(req, res, next) {
    if (req.params.id) {
        userModel.findOne({_id: req.params.id}, function(err, user) {
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
}

module.exports = loadUser;