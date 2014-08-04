
/**
 * MongoDB Comment schema
 */

var mongoose = require('mongoose');
var ObjectId = require("mongoose").Types.ObjectId;
var _ = require('underscore');
var validator = require('validator');

var commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    in_response: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    text: String,
    type: String,
    created: Date,
    updated: Date
});

function isObjectId(str){
    if (validator.isHexadecimal(str)) {
        if (str.length === 24)
            return true;
        else
            return false;
    } else {
        return false;
    }
}
    
validator.extend('isObjectId', function (str) {
    return isObjectId(str);
});

commentSchema.statics.getComments = function(req, next) {
    var params = {};

    if (req.query.attrs) {
        req.query.attrs = JSON.parse(req.query.attrs);
    } else if (!_.isEmpty(req.params) && req.params.id) {
        if (validator.isObjectId(req.params.id)) {
            params['_id'] = ObjectId(req.params.id);
        }
    }
    
    if (!_.isUndefined(req.query)) {
        _.each(req.query.attrs, function(value, key){
            if (value.type == 'objectid') {
                if (validator.isObjectId(value.value)) {
                    params[key] = ObjectId(value.value);
                }
            } else {
                params[key] = value.value;
            }
        });
    }

    this.find((params ? params : null))
        .sort({updated: (req.query.order ? req.query.order : 'desc')})
        .limit((req.query.count ? req.query.count : null))
        .populate('author', 'username image')
        .exec(function(err, comments) {
            if (err) {
                return next(err);
            }
            req.objects = comments;
            return next();
        });
};

module.exports = commentSchema;