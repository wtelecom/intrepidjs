
/**
 * Save an element
 */

var _ = require('underscore');
var rek = require('rekuire');
var updateOperation = rek('libs/crud_operations/update');
var postValidatorTreatment = rek('utils/post_validator');

function updateObject(path) {
    var modelObject = require(path);

    return function updateObject(req, res, next) {
        updateOperation(
            modelObject,
            postValidatorTreatment(req.body.attrs),
            postValidatorTreatment(_.omit(req.body, 'attrs')),
            next
        );
    };
}

module.exports = updateObject;
