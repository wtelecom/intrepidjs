/**
 * @file getAll.js
 * @desc Middleware to get model elements (API on-the-fly behaviour)
 */

var _ = require('underscore'),
    ObjectId = require("mongoose").Types.ObjectId;

/**
 * @desc Get a model objects, this function wait for the
 * next parameters in the req.query:
 * fields: Fields to return
 * options: Options to set in Mongoose query
 * @return function - Callback to continue the request
 */
function getObjects(model, privacy) {
    return function getObjects(req, res, next) {
        var conditions = null,
            fileds = null,
            options = null,
            m = null;

        conditions = req.query.conditions ? JSON.parse(req.query.conditions) : null;
        fields = req.query.fields ? req.query.fields : null;
        options = req.query.options ? JSON.parse(req.query.options) : null;

        // Check if model can be requested by anyone or not
        // This property is setted in the module settings file
        if (privacy) {
            if (_.isNull(conditions)) {
                conditions = {};
            }

            // Check if user is logged in, otherwise return error message
            try {
                conditions['author'] = req.user._id;
            } catch (err) {
                res.send(
                    {
                        error: err.message,
                        response: false
                    }
                );
            }
        }

        m = model.find(conditions);
        m.select(fields);

        // Set each option dynamically in the query
        if (options) {
            _.each(options, function(value, key) {
                m[key](value);
            });
        }

        m.exec(
            function(err, doc) {
                if (err) {
                    res.send({
                        error: err.message,
                        response: false
                    });
                } else {
                    req.objects = doc;
                    req.response = true;
                    next();
                }
            }
        );
    };
}

module.exports = getObjects;
