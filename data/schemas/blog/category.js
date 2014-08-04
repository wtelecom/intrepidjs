
/**
 * MongoDB Category schema
 */

var mongoose = require('mongoose'),
    _ = require('underscore');

var categorySchema = new mongoose.Schema({
    title: String,
    created: Date,
    updated: Date
});

module.exports = categorySchema;