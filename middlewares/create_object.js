
/**
 * Save an element
 */

var _ = require('underscore');
var rek = require('rekuire');
var createOperation = rek('libs/crud_operations/create');
var postValidatorTreatment = rek('utils/post_validator');

function createObject(path) {
    var modelObject = require(path);

    return function createObject(req, res, next) {
        createOperation(modelObject, postValidatorTreatment(req.body), next, req);
    };
}

module.exports = createObject;
