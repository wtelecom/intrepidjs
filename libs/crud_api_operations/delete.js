/**
 * @file delete.js
 * @desc Middleware to delete a model element (API on-the-fly behaviour)
 */

var _ = require('underscore');

/**
 * @desc Delete a model object
 * @return function - Callback to continue the request
 */
function deleteObject(model) {
    return function deleteObject(req, res, next) {
        if (req.params.id) {
            model.findOne({_id: req.params.id}, function (err, doc) {
                if (err) {
                    res.send({
                        error: err.message,
                        response: false
                    });
                } else {
                    doc.remove();
                    req.response = true;
                    next();
                }
            });
        } else {
            res.send({
                response: false
            });
        }
    };
}

module.exports = deleteObject;