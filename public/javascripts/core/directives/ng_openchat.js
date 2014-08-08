// Directive to open chat window.
angular.module('WeTalk').directive('openchat', [
    'socketIO',
    'uSession',
    function(socketIO, uSession) {
        return {
            restrict: 'A',
            replace: false,
            transclude: false,
            scope: {
                openchat: '@'
            },
            link: function(scope, elem, attrs) {
                elem.bind('click', function() {
                    var u = scope.openchat;
                    // Check if click on a user icon or on the header icon.
                    if (u) {
                        socketIO.emit('openChat', u);
                    } else {
                        // var users = _.filter(_.values(uSession.getUsers()), function (user) {
                        //     return user.read > 0 || user.unread > 0;
                        // });
                        // if (users.length > 0) {
                        //     u = _.first(users)._id;
                        //     socketIO.emit('openChat', u);
                        // } else {
                            socketIO.emit('openChat', null);
                        // }
                    }
                });
            }
        };
    }
]);
