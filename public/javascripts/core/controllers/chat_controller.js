/**
 * @file chat_controller.js
 * @namespace Chat Controller
 * This module manage AngularJS chat operations
 */


/**
  * @desc  Chat
  * @param object $scope - The controller scope var
  * @param object restService - Rest service
  * @param object socketIO - SocketIO service
  * @param object $location - Location service
  * @param object $anchorScroll - The Anchor Scroll service
  * @param object uSession - Service to comunicate with other controllers
*/
angular.module('IntrepidJS').controller('ChatController',
    [
        '$scope',
        'socketIO',
        'restService',
        '$location',
        '$anchorScroll',
        'uSession',
        function ($scope, socketIO, restService, $location, $anchorScroll, uSession) {
            // Initializing users in session.
            // Only these users will be shown in chat window.
            $scope.usersInSession = {};
            $scope.rooms = {};

            // AutoScroll chat bottom
            $scope.glued = true;


            // Get User from request
            restService.get({}, 'api/v1/info',
                function(data, status, headers, config) {
                    // Set user in scope.
                    $scope.user = data.user;

                    if($scope.user) {
                        var emitData = {
                            user: $scope.user._id,
                            session: data.session
                        };
                        socketIO.emit('userConnect', emitData);
                        // Open/close chat window
                        $scope.chatVisible = false;
                    }
                },
                function(data, status, headers, config) {
                    console.log("User has not been logged successfully.");
                }
            );


            // It's called when change global messages.
            $scope.$watch('globalMessages', function () {
                uSession.setGMessages($scope.globalMessages);
            });


            // It's called when change usersInSession.
            $scope.$watch('usersInSession', function () {
                uSession.setUsers($scope.usersInSession);
            });

            // When I connect, tell me the users in my session.
            // Show online and offline users
            socketIO.on('sessionChatUsers', function (data) {
                $scope.usersInSession = data.uaccs;
                $scope.globalMessages = data.nMessages;
            });
            

            // It's called when a user has been connected to chat.
            socketIO.on('userConnected', function (user) {
                if ($scope.user)
                    if (_.has($scope.usersInSession, user))
                        $scope.usersInSession[user].state = 'online';
            });


            // It's called when a user has been disconnected.
            socketIO.on('userDisconnected', function (user) {
                if ($scope.user)
                    if (_.has($scope.usersInSession, user))
                        $scope.usersInSession[user].state = 'offline';
            });


            // When message is received
            socketIO.on('newChatMessage', function(msg){
                if (msg.user_dst._id.toString() == $scope.user._id.toString()) {
                    // Check if not exists user and room in session.
                    if(!_.has($scope.usersInSession, msg.user_src._id)) {
                        // Add chat user to request session
                        var uid = msg.user_src._id.toString();
                        restService.post({room:uid}, 'api/v1/room',
                            function(data, status, headers, config) {
                                // Adding user session
                                $scope.usersInSession[msg.user_src._id] = msg.user_src;
                                // Check messages unreaded
                                socketIO.emit('checkUnread', msg.user_src._id);
                            },
                            function(data, status, headers, config) {
                                console.log('Error saving room in session.');
                            }
                        );
                    } else {
                        // Render message - other
                        $scope.msgReceived(msg);
                    }

                } else {
                    // Render message - me
                    $scope.msgReceived(msg);
                }
            });

            // When receiver user messages
            socketIO.on('userMsgs', function(data){
                var other = data.uid.other._id.toString();
                $scope.rooms[other] = {};
                $scope.rooms[other].messages = data.lastMessages;
                var unread = _.filter($scope.rooms[other].messages, function (msg) {
                    return msg.read === false && msg.user_dst._id == $scope.user._id;
                });

                var n = $scope.usersInSession[other].unread;
                var first_unread;
                if (unread.length > 0) {
                    first_unread = _.last(unread);
                } else if (n > 0) {
                    first_unread = _.first($scope.rooms[other].messages);
                }
                if (first_unread) {
                    setTimeout(function(){
                        // Mark as read all messages
                        var g =  uSession.getGMessages();
                        var r = g - n;
                        socketIO.emit('chatAllRead', data.uid.other._id);
                        uSession.setGMessages(r);
                        $scope.usersInSession[other].unread = 0;

                        // Go to first unread message
                        $scope.$apply(function () {
                            $('.room[room="' + other + '"]')
                            .scrollTop($('#msg'+first_unread._id.toString()).offset().top);
                        });
                        // $location.hash('msg'+first_unread._id.toString());
                        // $anchorScroll();
                    }, 1);
                }
            });


            // Set number of unread messages of a user.
            socketIO.on('numUnreadMsgs', function (data) {
                $scope.usersInSession[data._id.toString()].unread = data.total;
                if (!$scope.globalChatMessage) {
                    uSession.setGMessages(1);
                }
            });

            // When user chat window is opening 
            socketIO.on('openChatUser', function (u) {
                if (u) {
                    // Setting user and room actives.
                    $scope.userActive = u._id.toString();
                    if (!_.has($scope.usersInSession, $scope.userActive)) {
                        $scope.usersInSession[$scope.userActive] = u;
                        // Save the user in session
                        restService.post({room:$scope.userActive}, 'api/v1/room',
                            function(data, status, headers, config) {
                                console.log('Room saved in session successfully.');
                            },
                            function(data, status, headers, config) {
                                console.log('Error saving room in session.');
                            }
                        );
                    }
                        
                    var user = $scope.usersInSession[$scope.userActive];
                    $scope.uChatName = user.username;
                    socketIO.emit('getUserMsgs', user);
                    $scope.chatVisible = true;
                    angular.element('#chat-text > input').focus();
                } else {
                    $scope.chatVisible = true;
                }
            });


            // Pass the msg to render
            $scope.msgReceived = function (msg) {
                // Check if the two users are chatting together.
                if (($scope.userActive == msg.user_src._id.toString() && $scope.chatVisible) || $scope.userActive == msg.user_dst._id.toString()) {
                    // Mark read if the other has read it.
                    if (msg.user_dst._id === $scope.user._id) {
                        msg.read = true;
                        socketIO.emit('readMsg', msg._id);
                    }
                } else {
                    ++$scope.usersInSession[msg.user_src._id].unread;
                    var nm = uSession.getGMessages();
                    uSession.setGMessages(++nm);
                }
                // Render message
                if (msg.user_dst._id.toString() === $scope.user._id.toString()) {
                    // Other
                    if (_.has($scope.rooms, msg.user_src._id))
                        $scope.rooms[msg.user_src._id].messages.push(msg);
                } else {
                    // Me
                    $scope.rooms[msg.user_dst._id.toString()].messages.push(msg);
                }

            };


            // Close chat window
            $scope.close = function(){
                $scope.chatVisible = false;
                $scope.userActive = null;
            };

            // Comunicate to server new message
            $scope.send = function(){
                if ($scope.user) {
                    var text = $scope.chatText;
                    if (!_.isEmpty(text)) {
                        $scope.chatText = "";
                        $scope.chat_el = angular.element('#chat-content');
                        
                        var data = {
                            user_src: $scope.user._id,
                            user_dst: $scope.userActive,
                            message: text
                        };
                        socketIO.emit('sendChatMessage', data);
                    }
                    // Scroll to bottom
                    $scope.glued = true;
                }
            };

            // Open a specific user chat window when clik at user image.
            $scope.chatWith = function(element){
                if ($scope.user) {
                    // Setting user and room actives.
                    var user_active = angular.element(element);
                    $scope.userActive = user_active.attr('uid');
                    $scope.uChatName = user_active.find('span.uname').text();
                    angular.element('#chat-text > input').focus();
                    var user = $scope.usersInSession[$scope.userActive];
                    socketIO.emit('getUserMsgs', user);
                }
            };

        }
    ]
);


// Small controller to show the number of global unread messages on the header.

/**
  * @desc  Chat
  * @param object $scope - The controller scope var
  * @param object uSession - Service to comunicate with other controllers
*/
angular.module('IntrepidJS').controller('globalChatMessages',
    [
        '$scope',
        'uSession',
        function($scope, uSession) {
            $scope.uSession = uSession;
            $scope.$watch('uSession.getGMessages()', function() {
                $scope.globalChatMessages = uSession.getGMessages();
            });
        }
    ]
);