/**
 * @file profile_mail_read_controller.js
 * @namespace Profile Controller
 * This module manage AngularJS profile operations
 */


 // This controller loads the profile interface.


angular.module('IntrepidJS').controller('ProfileMailReadController',
    [
        '$scope',
        '$sce',
        '$state',
        'restService',
        profileMailReadController
    ]
);

        function profileMailReadController($scope, $sce, restService, $state) {
            var forMe = function (us) {
                return String(us._id ? us._id : us) === String(user._id);
            };

            $scope.readMail = function () {
                if ($state.params && $state.params.mail) {
                    restService.get({}, apiPrefix + '/mails/' + $state.params.mail,
                        function(data, status, headers, config) {
                            if (data.success) {
                                if (data.mail) {
                                    if (data.mail.children.length) {
                                        _.each(data.mail.children, function(child) {
                                            if (forMe(child.user_dst)) {
                                                _.extend(child.user_dst, {me: true});
                                            }
                                            child.text = $sce.trustAsHtml(child.text);
                                        });
                                    }
                                    $scope.$parent.mail = data.mail;
                                    if (forMe(data.mail.user_dst)) {
                                        _.extend($scope.$parent.mail.user_dst, {me: true});
                                    }
                                    $scope.$parent.mail.text = $sce.trustAsHtml($scope.$parent.mail.text);

                                    $scope.$parent.backState = forMe($scope.$parent.mail.user_dst) ? 'profile.mail.inbox' : 'profile.mail.sent';
                                    $scope.$parent.replyBtnShow = true;
                                    $scope.$parent.backBtnShow = true;
                                }
                            }
                        },
                        function(data, status, headers, config) {}
                    );
                }
            };

            $scope.$on('mailSent', function(event, data) {
                if (data.success) {
                    $scope.readMail();
                }
            });

        }