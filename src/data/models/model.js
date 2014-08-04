
/**
 * @file @name.js
 * @namespace @name model
 * @desc MongoDB @name object model
 */


var mongoose = require('mongoose'),
    rek = require('rekuire'),
    moduleSchema = rek('modules/@iname/data/schemas/schema'),
    schema = mongoose.model('@name', moduleSchema);

module.exports = schema;
