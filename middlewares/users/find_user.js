
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
            if(req.user._id == req.params.id){
                user = _.pick(user, '_id', 'image', 'username', 'email');
            }else{
                user = _.pick(user, '_id', 'image', 'username');
            }
            req.object = user;
            next();
        });
    }
}

module.exports = loadUser;