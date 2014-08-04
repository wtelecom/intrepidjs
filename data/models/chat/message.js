
/**
 * Message model
 */

var rek = require('rekuire');
var mongoose = require('mongoose');
var messageSchema = rek('data/schemas/chat/message');

var message = mongoose.model('Chat_Message', messageSchema);
module.exports = message;