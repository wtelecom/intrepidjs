
/**
 * User model
 */

var mongoose = require('mongoose');
var rek = require('rekuire');
var userSchema = rek('data/schemas/users/user');

var user = mongoose.model('User', userSchema);
module.exports = user;