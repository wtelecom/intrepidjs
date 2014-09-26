/**
 * @file main_controller.js
 * @namespace Index Controller
 * This module manage AngularJS index operations
 */

// This controller is a dummy controller.
// It's only purpose is to show the highlights of the modules
angular.module('IntrepidJS').controller('SignupController',
    [
        '$scope',
        'restService',
        'i18n',
        function ($scope, restService, i18n) {
            $scope.errors = {};
            $scope.checkUser = function() {
                if ($scope.username) {
                    restService.get(
                        {},
                        apiPrefix + '/users/exist/' + $scope.username,
                        function(data, status, headers, config) {
                            if (!data.available) {
                                $scope.errors.username = {message: i18n.__('Username in use')};
                            } else {
                                delete $scope.errors.username;
                            }
                        },
                        function(data, status, headers, config) {}
                    );
                }
            };
            var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
            $scope.$watch('email', function() {
                if ($scope.email) {
                    if ($scope.email.search(regExp) === -1) {
                        $scope.errors.email = {message: i18n.__('Wrong email')};
                    } else {
                        delete $scope.errors.email;
                    }
                }
            });
            $scope.$watch('password', function() {
                if ($scope.password) {
                    if ($scope.password.length < 2) {
                        $scope.errors.password = {message: i18n.__('Password too short')};
                    } else {
                        delete $scope.errors.password;
                    }
                }
            });

            $scope.$watch(function() { return $scope.errors; }, function() {
                if (_.isEmpty($scope.errors) && $scope.username && $scope.email && $scope.password) {
                    $scope.disabled = false;
                } else {
                    $scope.disabled = true;
                }
            }, true);

        }
    ]
);
