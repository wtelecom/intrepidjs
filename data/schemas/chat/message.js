
/**
 * MongoDB Message schema
 */

var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    user_src: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    user_dst: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    text: String,
    created: {type: Date, default: Date.now },
    read: {type: Boolean, default: false }
});

module.exports = messageSchema;