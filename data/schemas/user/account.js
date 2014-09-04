
/**
 * MongoDB Account schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    firstName: String,
    lastName: Date,
    email: String,
    roles: [],
    image: String,
    created: {type: Date, default: Date.now }
});

Account.plugin(passportLocalMongoose);



Account.statics.getObjects = function(order, count, attr, req, next) {
    var params = req.query.attrs ? JSON.parse(req.query.attrs) : {};
    this.find(params.data ? params.data : {})
    .select('username image roles')
    .sort(params.sort ? params.sort : 'username')
    .exec(function(err, objects) {
        if (err) {
            return next(err);
        }
        req.objects = objects;
        return next();
    });
};

Account.statics.getRoles = function(req, next) {
    this.distinct('roles')
    .exec(function(err, roles) {
        if (err) {
            return next(err);
        }
        req.roles = roles;
        return next();
    });
};


module.exports = mongoose.model('Account', Account);