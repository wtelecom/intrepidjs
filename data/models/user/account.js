/**
 * Account model
 */

var mongoose = require('mongoose');
var rek = require('rekuire');
var accountSchema = rek('data/schemas/user/account');

var account = mongoose.model('Account', accountSchema);
module.exports = account;