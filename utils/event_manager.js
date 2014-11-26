/**
 * @file event_manager.js
 * @namespace Event Manager
 * @desc This module manage pub/sub events in the app
 */
var EventEmitter = require('events').EventEmitter;

var eventController = new EventEmitter();
	//events.emit('user-created', userObj);

eventController.eventList = [
	'user-created'
];
module.exports=eventController;