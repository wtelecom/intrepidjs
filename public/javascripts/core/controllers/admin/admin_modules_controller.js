/**
 * @file admin__modules_controller.js
 * @namespace Admin Controller
 * @desc This module manage AngularJS admin modules operations
 */
 
angular.module('IntrepidJS')
    .controller('AdminModulesController',
        [
            '$scope',
            '$templateCache',
            '$window',
            'restService',
            'i18n',
            adminModulesController        
        ]
    );

function adminModulesController($scope, $templateCache, $window, restService, i18n) {
            // TODO: Check why request fails when enabled param is false
    restService.get(
        {},
        '/api/v1/admin/modules/',
        function(data, status, headers, config) {
            $scope.modules = {};
            _.each(data.modules, function (m) {
                $scope.modules[m.name] = m;
                $scope.modules[m.name].real_name = i18n.__(m.real_name);
                $scope.$watch(
                    function () { return $scope.modules[m.name].enabled; },
                    function (vnew, vold) {
                        if (vnew != vold) {
                            restService.post(
                                {
                                    module: m.name,
                                    enabled: vnew
                                },
                                apiPrefix + '/admin/modules/update',
                                function(data, status, headers, config) {
                                    if (data.success) {
                                        $window.location.reload();
                                    }
                                },
                                function(data, status, headers, config) {
                                    $window.location.reload();
                                }
                            );
                        }
                }, true);
            });
        },
        function(data, status, headers, config) {}
    );
    restService.get(
        {},
        '/api/v1/admin/main_modules',
        function(data, status, headers, config) {
            $scope.mainModules = {};
            _.each(data.modules, function (m) {
                $scope.mainModules[m.name] = m;
                $scope.mainModules[m.name].real_name = i18n.__(m.real_name);
                $scope.$watch(
                    function () { return $scope.mainModules[m.name].enabled; },
                    function (vnew, vold) {
                        if (vnew != vold) {
                            restService.post(
                                {
                                    module: m.name,
                                    enabled: vnew
                                },
                                apiPrefix + '/admin/main_modules/update',
                                function(data, status, headers, config) {
                                    if (data.success) {
                                        $window.location.reload();
                                    }
                                },
                                function(data, status, headers, config) {
                                    $window.location.reload();
                                }
                            );
                        }
                }, true);
            });
        },
        function(data, status, headers, config) {}
    );
}