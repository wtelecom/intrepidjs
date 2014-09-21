
/**
 * MongoDB Measure comment schema
 */

var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    rek = require('rekuire');

var chatMessageSchema = rek('data/schemas/chat/message');

var mailSchema = chatMessageSchema.extend({
    subject: String,
    children: [mongoose.Schema.Types.Mixed],
    updated: {type: Date, default: Date.now },
    read_by: [{type: mongoose.Schema.Types.ObjectId,ref: 'Account'}]
});

module.exports = mailSchema;