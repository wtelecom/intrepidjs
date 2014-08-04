
/**
 * Category model
 */

var rek = require('rekuire');
var mongoose = require('mongoose');
var categorychema = rek('data/schemas/blog/category');

var category = mongoose.model('Category', categorySchema);
module.exports = category;