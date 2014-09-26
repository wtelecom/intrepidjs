/**
 * @file chat_service.js
 * @namespace SocketIO services
 * This service manage SocketIO operations
 */

angular.module('IntrepidJS')
.service('uSession', function () {
    var users = null;
    var globalMessages = 0;

    return {
        getUsers: function () {
            return users;
        },
        setUsers: function(value) {
            users = value;
        },
        getGMessages: function () {
            return globalMessages;
        },
        setGMessages: function(value) {
            globalMessages = value;
        }
    };
});
