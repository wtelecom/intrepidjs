/**
 * @file main_controller.js
 * @namespace Index Controller
 * This module manage AngularJS index operations
 */


// This controller manage header info.
angular.module('IntrepidJS').controller('HeaderController',
    [
        '$scope',
        '$location',
        '$window',
        '$timeout',
        'restService',
        function ($scope, $location, $window, $timeout, restService) {
            $scope.formData = {};

            $scope.provide_path = function() {
                lastPath = $location.url();
            };

            $scope.account_process = function(action) {
                switch(action) {
                    case 'logout':
                        restService.get(
                            {},
                            '/accounts/logout',
                            function(data, status, headers, config) {
                                if (data.success) {
                                    window.location = '/';
                                }
                            },
                            function(data, status, headers, config) {
                            }
                        );
                        break;
                    case 'login':
                        $scope.loginError = false;
                        restService.post(
                            {
                                username: $scope.formData.username,
                                password: $scope.formData.password
                            },
                            '/accounts/login',
                            function(data, status, headers, config) {
                                if (data.success) {
                                    $location.url(lastPath);
                                    $timeout(function() {
                                        location.reload();
                                    },0);
                                }else{
                                    $scope.loginError=true;
                                    $scope.formData = {}
                                }
                            },
                            function(data, status, headers, config) {
                              $scope.loginError = true;
                            }
                        );
                        break;
                    default:
                        break;
                }

            };
        }
    ]
);


// This controller is a dummy controller.
// It's only purpose is to show the highlights of the modules
angular.module('IntrepidJS').controller('HighLightsController',
    [
        '$scope',
        function ($scope) {
        }
    ]
);
