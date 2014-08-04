/**
 * @file load_comments.js
 * @namespace Load Comments
 * @desc This module load all post comments
 */

var rek = require('rekuire'),
    _ = require('underscore'),
    commentModel = rek('data/models/blog/comment'),
    accountModel = rek('data/models/user/account'),
    ObjectId = require("mongoose").Types.ObjectId,
    Promise = require("mongoose").Promise;


/**
 * @desc  Load posts comments
 * @param object req.objects - Post comments availables
 */
function loadComments(model) {
    return function loadComments(req, res, next) {
        if (model) {
            if (req.query.attrs) {
                req.query.attrs = JSON.parse(req.query.attrs);
                var m = model.aggregate([]);
                m.match({ post: ObjectId(req.query.attrs.post.value) });
                if (req.query.order) {
                    m.sort({"created": req.query.order});
                }
                m.group({ _id : '$in_response', comments: {$push: '$$ROOT'}, no_comments: {$sum: 1}});
                m.exec(function(err, result) {
                    if (err) {
                        next(err);
                    } else {
                        var comments = [];
                        var no_comments = 0;
                        if (!_.isEmpty(result)) {
                            accountModel.populate(result, {path: "comments.author", select: 'username image'}, function(err, objects) {
                                var parentComments = _.first(_.where(objects, {_id: null}));
                                no_comments += parentComments.no_comments;
                                _.each(parentComments.comments, function(parentComment) {
                                    var child_obj =_.filter(result, function(o) {
                                        return String(o._id) == String(parentComment._id);
                                    });
                                    
                                    if (!_.isEmpty(child_obj)) {
                                        no_comments += _.first(child_obj).no_comments;
                                        parentComment['comments'] = _.first(child_obj).comments;
                                    }
                                    comments.push(parentComment);
                                });
                                req.objects = {comments: comments, no_comments: no_comments};
                                next();
                            });
                        } else {
                            req.objects = {comments: comments, no_comments: no_comments};
                            next();
                        }
                    }
                });
            } else {
                next();
            }
        } else {
            commentModel.getComments(req, next);
        }
    };
}

module.exports = loadComments;