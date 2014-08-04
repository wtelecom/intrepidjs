
/**
 * Setting model
 */

var rek = require('rekuire');
var mongoose = require('mongoose');
var settingSchema = rek('data/schemas/admin/setting');

var setting = mongoose.model('Setting', settingSchema);
module.exports = setting;