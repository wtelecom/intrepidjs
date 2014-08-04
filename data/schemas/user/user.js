
/**
 * MongoDB User schema
 */

var rek = require('rekuire');
var hash = rek('utils/hash');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	firstName:  String,
    lastName:   String,
    email:      String,
    salt:       String,
    hash:       String,
    facebook:{
        id:       String,
        email:    String,
        name:     String
    },
    google:{
        id:       String,
        email:    String,
        name:     String
    }
});

userSchema.statics.signup = function(email, password, done){
    var User = this;
    hash(password, function(err, salt, hash){
        if(err) throw err;
        User.create({
            email : email,
            salt : salt,
            hash : hash
        }, function(err, user){
            if(err) throw err;
            done(null, user);
        });
    });
};

userSchema.statics.isValidUserPassword = function(email, password, done) {
    this.findOne({email : email}, function(err, user){
        if(err) return done(err);
        if(!user) return done(null, false, { message : 'Incorrect email.' });
        hash(password, user.salt, function(err, hash){
            if(err) return done(err);
            if(hash == user.hash) return done(null, user);
            done(null, false, {
                message : 'Incorrect password'
            });
        });
    });
};

module.exports = userSchema;





