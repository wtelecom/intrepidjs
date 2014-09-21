
/**
 * Mail model
 */

var mongoose = require('mongoose');
var rek = require('rekuire');
var mailSchema = rek('data/schemas/mail/mail');

var mail = mongoose.model('Mail', mailSchema);
module.exports = mail;