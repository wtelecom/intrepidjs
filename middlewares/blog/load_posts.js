
/**
 * Get posts
 */

var rek = require('rekuire');
var blogModel = rek('data/models/blog/post');

function loadPosts(model) {
    return function loadPosts(req, res, next) {
        if (model)
            model.getPosts(req, next);
        else
            blogModel.getPosts(req, next);
    };
}

module.exports = loadPosts;