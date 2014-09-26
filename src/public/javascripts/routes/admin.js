/**
 * @file admin.js
 * @namespace @name admin angular routes
 * @desc @name admin angular routes
 */


angular.module('IntrepidJS').config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider.
                state('admin.modules.@iname', {
                    url: '/@iname',
                    views: {
                        "actions_parent_content":
                            {
                                templateUrl: "/@iname/admin/parent",
                                controller: "@nameAdminIndexController"
                            }
                    }
                });
        }
    ]
);