
/**
 * MongoDB Account schema
 */

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    rek = require('rekuire'),
    Schema = mongoose.Schema,
    crypto = require('crypto');


var Account = new Schema({
    salt: String,
    hashed_password: String,
    username: String,
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

Account.set("toJSON", { virtuals: true });

var validatePresenceOf = function(value) {
  return (value&&value.length)
}

Account.virtual("password").set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
}).get(function(){
  return this._password;
})

Account.pre("save", function(next) {
  if (!this.isNew) return next();
  if (!validatePresenceOf(this.password)) {
    next(new Error("Invalid password"));
  } else {
    next();
  }
})

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

Account.methods = {
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ""
  },

  encryptPassword: function(password) {
    if (!password) return "";
    var encrypted = undefined;

    try {
      encrypted = crypto.createHmac("sha1", this.salt).update(password).digest("hex")
      return encrypted
    } catch (err) {
      return ""
    }
  },

  authenticate: function(plainText) {
    return (this.encryptPassword(plainText)===this.hashed_password)
  }

}

module.exports = mongoose.model('Account', Account);
