/**
 * @file post_validator.js
 * @namespace Post Validator
 * @desc This module sanitizes the data after validation
 */


var _ = require('underscore');
var ObjectId = require("mongoose").Types.ObjectId;

/**
 * @desc  Treatment to sanitize the data
 * @param object $data - Data after validation process
 * @return object - Sanitized data
 */
function postValidatorTreatment(data) {
    var sanitizeData = {};
    _.each(data, function(value, key){
        if (value.type == 'objectid')
            sanitizeData[key] = ObjectId(value.value);
        else
            sanitizeData[key] = value.value;
    });

    return sanitizeData;
}

module.exports = postValidatorTreatment;