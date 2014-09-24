/**
 * @file create.js
 * @desc Middleware to create a model element (API on-the-fly behaviour)
 */

var _ = require('underscore');

/**
 * @desc Create a model object
 * @return function - Callback to continue the request
 */
function createObject(model) {
    return function createObject(req, res, next) {
        var newData = null;

        // TODO: Check if data keys are the same as the schema keys
        if (req.body) {
            if (_.isObject(req.body)) {
                newData = req.body ? req.body : null;
            } else {
                newData = req.body ? JSON.parse(req.body) : null;
            }

            if (!req.query.apikey && !_.isUndefined(model.schema.paths.author))
                newData.author = req.user;
        }

        model.create(newData, function(err, doc) {
            if (err) {
                res.send({
                    error: err,
                    response: false
                });
            } else {
                req.objects = doc;
                req.response = true;
                next();
            }
        });
    };
}

module.exports = createObject;
