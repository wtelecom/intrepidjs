
/**
 * Save an element
 */

var _ = require('underscore');
var rek = require('rekuire');
var deleteOperation = rek('libs/crud_operations/delete');
var postValidatorTreatment = rek('utils/post_validator');

function deleteObject(path) {
    var modelObject = require(path);

    return function deleteObject(req, res, next) {
        deleteOperation(
            modelObject,
            postValidatorTreatment(req.body.attrs),
            next
        );
    };
}

module.exports = deleteObject;
