/**
 * @file chat_service.js
 * @namespace SocketIO services
 * This service manage SocketIO operations
 */
(function(){
    'use strict';

    angular.module('IntrepidJS')
        .factory('uSession',['$timeout', uSession]);

    function uSession($timeout) {
    
        var uSession = {
            users:  null,
            globalMessages : 0,
            properties : {
                isShown : false,
                glued : true,
                },
            getUsers : function () {
                return uSession.users;
            },
            setUsers : function(value) {
                uSession.users = value;
            },
            getGMessages : function () {
                return uSession.globalMessages;
            },
            setGMessages : function(value) {
                uSession.globalMessages = value;
            },
            setChatVisibility : function(visible){
                //$timeout(function(){
                    uSession.properties.isShown = visible;
                //},0);
            },
            scrollBottom : function(){
                uSession.properties.glued=true;
            }
        };
        return uSession;
    }

})();