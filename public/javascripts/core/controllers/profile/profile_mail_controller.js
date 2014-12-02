/**
 * @file profile_mail_controller.js
 * @namespace Profile Controller
 * This module manage AngularJS profile operations
 */


 // This controller manage the mail page controller.

angular.module('IntrepidJS').controller('ProfileMailController',
    [
        '$scope',
        '$state',
        'restService',
        profileMailController
    ]
);

        function profileMailController($scope, $state,restService) {

            $scope.theOther = function (users) {
                return _.find(users, function(u) {
                    return String(u._id) != String(user._id);
                });
            };
            $scope.user = user;

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                if (toState.name == 'profile.mail') {
                    $state.transitionTo('profile.mail.inbox');
                }
            });

            $scope.writeBtnShow = true;
            $scope.formData = {};
            $scope.dateFormat = 'EEEE MMMM d, y - HH:mm';

            $scope.create = function () {
                restService.post($scope.formData, apiPrefix + '/mails/create',
                    function(data, status, headers, config) {
                        if (data.success) {
                            $scope.getMails();
                        }
                    },
                    function(data, status, headers, config) {}
                );
            };

            $scope.getMails = function() {
                $scope.backBtnShow = false;
                $scope.replyBtnShow = false;

                restService.get({}, apiPrefix + '/mails',
                    function(data, status, headers, config) {
                        if (data.success) {
                            if ($state.current.name === 'profile.mail.inbox') {
                                $scope.mails = data.mails.inbox;
                                $scope.isInbox = true;
                            } else if ($state.current.name === 'profile.mail.sent') {
                                $scope.mails = data.mails.sent;
                                $scope.isInbox = false;
                            }
                           
                        }
                    },
                    function(data, status, headers, config) {}
                );
            };

            $scope.readMail = function (mail) {
                $scope.backBtnShow = true;
                // $scope.mail = mail;
                $scope.replyBtnShow = true;
                $state.transitionTo('profile.mail.read', {mail: mail._id});
            };

        }