
/**
 * Post model
 */

var rek = require('rekuire');
var mongoose = require('mongoose');
var postSchema = rek('data/schemas/blog/post');

var post = mongoose.model('Post', postSchema);
module.exports = post;