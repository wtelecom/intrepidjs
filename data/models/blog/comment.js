
/**
 * Comment model
 */

var rek = require('rekuire');
var mongoose = require('mongoose');
var commentSchema = rek('data/schemas/blog/comment');

var comment = mongoose.model('Comment', commentSchema);
module.exports = comment;