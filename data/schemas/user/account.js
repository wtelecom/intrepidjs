
/**
 * MongoDB Account schema
 */

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    rek = require('rekuire'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    crypto = require('crypto');

var Account = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, require: true },
    roles: [],
    image: String,
    created: {type: Date, default: Date.now },
    updated: {type: Date, default: Date.now },
    token: String,
    token_updated: {type: Date, default: Date.now },
    subscriptions: mongoose.Schema.Types.Mixed
});

Account.plugin(passportLocalMongoose);
Account.plugin(uniqueValidator);

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

Account.statics.validPassword = function(id, password, cb) {
    validPassword(this, id, password, cb);
};

Account.methods.validPassword = function(id, password, cb) {
    validPassword(this.model('Account'), id, password, cb);
};

function validPassword(model, id, password, cb) {
    model.findOne({_id: id})
        .exec(function(err, user) {
            if (user) {
                crypto.pbkdf2(password, user.salt, 25000, 512, function(err, hashRaw) {
                    if (err) {
                        return cb(false);
                    }
                    
                    var hash = new Buffer(hashRaw, 'binary').toString('hex');

                    if (hash === user.hash) {
                        return cb(true, user);
                    } else {
                        return cb(false);
                    }
                });
            } else {
                return cb(false);
            }
        });
}

module.exports = mongoose.model('Account', Account);