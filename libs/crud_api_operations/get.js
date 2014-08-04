/**
 * @file get.js
 * @desc Middleware to get model element (API on-the-fly behaviour)
 */

var _ = require('underscore');

/**
 * @desc Get a model object, this function wait for the
 * next parameters in the req.query:
 * fields: Fields to return
 * options: Options to set in Mongoose query
 * @return function - Callback to continue the request
 */
function getObject(model, cb) {
    return function getObject(req, res, next) {
        var fileds = null,
            options = null,
            m = null;

        fields = req.query.fields ? req.query.fields : null;
        options = req.query.options ? JSON.parse(req.query.options) : null;

        m = model.findById(req.params.id);
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
                    var fn_call = cb ? cb : next;
                    fn_call();
                }
            }
        );
    };
}

module.exports = getObject;
