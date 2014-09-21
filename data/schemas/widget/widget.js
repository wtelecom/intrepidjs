
/**
 * MongoDB Widget schema
 */

var mongoose = require('mongoose'),
    ObjectId = require("mongoose").Types.ObjectId,
    _ = require('underscore');

var widgetSchema = new mongoose.Schema({
    type: String,
    parent: String,
    name: String,
    real_name: String,
    fields: mongoose.Schema.Types.Mixed,
    enabled: Boolean,
    position: Number,
    order: Number,
    header: Boolean
});


widgetSchema.statics.getWidgetsInfo = function(req, next, name) {
    var params = {};
    if (req.query.attrs)
        req.query.attrs = JSON.parse(req.query.attrs);

    if (!_.isUndefined(req.query)) {
        _.each(req.query.attrs, function(value, key) {
            params[key] = value.value;
        });
    }

    this.find((params ? params : null))
        .exec(function(err, widgets) {
            if (err) {
                return next(err);
            }
            if (name) {
                req[name] = widgets;
            } else {
                req.objects = widgets;
            }
            return next();
        });
};

widgetSchema.statics.getWidgets = function(req, next, name) {
    this.find((req.query ? req.query : null))
        .exec(function(err, widgets) {
            if (err) {
                return next(err);
            }
            if (name) {
                req[name] = widgets;
            } else {
                req.objects = widgets;
            }
            return next();
        });
};

module.exports = widgetSchema;