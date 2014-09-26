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
        'restService',
        function ($scope, $location, $window, restService) {
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
                        restService.post(
                            {
                                username: $scope.formData.username,
                                password: $scope.formData.password
                            },
                            '/accounts/login',
                            function(data, status, headers, config) {
                                if (data.success) {
                                    $location.url(lastPath);
                                    setTimeout(function() {
                                        location.reload();
                                    }, 0);
                                    
                                }
                            },
                            function(data, status, headers, config) {
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