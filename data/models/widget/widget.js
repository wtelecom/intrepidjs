/**
 * Widget model
 */

var mongoose = require('mongoose');
var rek = require('rekuire');
var widgetSchema = rek('data/schemas/widget/widget');

var widget = mongoose.model('Widget', widgetSchema);
module.exports = widget;