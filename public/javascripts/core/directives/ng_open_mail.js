/*globals user */

// Directive to open mail modal.
angular.module('IntrepidJS').directive('ngOpenMail', [
    '$rootScope',
    'restService',
    function($rootScope, restService) {
        return {
            restrict: 'E',
            replace: false,
            transclude: false,
            scope: {
                uid: '=',
                reply: '='
            },
            templateUrl: function (element, attrs) {
                if (attrs.type) {
                    if (attrs.type === 'reply') {
                        return 'profile/partials/reply.jade';
                    }
                }
                return 'profile/partials/modal.jade';
            },
            link: function($scope, elem, attrs) {
                $scope.meUser = user;
                if (!user || !user._id || $scope.uid === user._id) {
                    elem.remove();
                }
                $scope.writeTemplate = 'profile/partials/write.jade';
                $scope.textOptions = {
                    height: 150,
                    toolbar: [
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol']]
                    ]
                };
                elem.find('[data-toggle="modal"]').bind('click', function() {
                    $scope.mailData = {};
                    if ($scope.uid) {
                        restService.get({}, apiPrefix + '/user/' + $scope.uid,
                            function(data, status, headers, config) {
                                if (data.success) {
                                    $scope.receiver = data.user;
                                    $scope.mailData.user_dst = $scope.uid;
                                }
                            },
                            function(data, status, headers, config) {}
                        );
                    }
                    if ($scope.reply) {
                        $scope.$apply(function() {
                            $scope.receiver = String($scope.reply.user_src._id) === String(user._id) ? $scope.reply.user_dst : $scope.reply.user_src;
                            $scope.mailData.user_dst = $scope.receiver._id;
                            $scope.mailData.reply = $scope.reply._id;
                            if ($scope.reply.subject) {
                                $scope.mailData.subject = 'Re: ' + $scope.reply.subject;
                            }
                        });
                    }
                });

                $scope.create = function() {
                    restService.post($scope.mailData, apiPrefix + '/mails/create',
                        function(data, status, headers, config) {
                            $rootScope.$broadcast('mailSent', data);
                        },
                        function(data, status, headers, config) {}
                    );
                };
            }
        };
    }
]);
