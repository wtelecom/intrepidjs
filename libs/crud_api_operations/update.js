/**
 * @file update.js
 * @desc Middleware to update a model element (API on-the-fly behaviour)
 */

var _ = require('underscore');

/**
 * @desc Update a model object, this function wait for the
 * next parameters in the req.body:
 * data: Data to update
 * options: Options to set in Mongoose query
 * @return function - Callback to continue the request
 */
function updateObject(model, query, data, cb) {
    return function updateObject(req, res, next) {
        var dataToUpdate = null,
            options = null;

        if (req.body) {
            if (_.isObject(req.body.data)) {
                dataToUpdate = req.body.data ? req.body.data : null;
            } else {
                dataToUpdate = req.body.data ? JSON.parse(req.body.data) : null;
            }

            if (_.isObject(req.body.options)) {
                options = req.body.options ? req.body.options : null;
            } else {
                options = req.body.options ? JSON.parse(req.body.options) : null;
            }
        }

        model.findByIdAndUpdate(
            req.params.id,
            dataToUpdate,
            options,
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

module.exports = updateObject;
