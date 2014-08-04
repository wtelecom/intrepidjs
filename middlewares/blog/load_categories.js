
/**
 * Load categories
 */

var rek = require('rekuire');
var blogModel = rek('data/models/blog/post');

function loadCategories(model) {
    return function loadPosts(req, res, next) {
        if (model)
            model.getCategories(req, next);
        else
            blogModel.getCategories(req, next);
    };
}

module.exports = loadCategories;