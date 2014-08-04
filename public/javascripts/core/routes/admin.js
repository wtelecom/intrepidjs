/**
 * @file admin.js
 * @namespace Main admin angular routes
 * @desc Main admin angular routes
 */


angular.module('WeTalk').config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            
            $stateProvider.
                state('admin', {
                    url: '/admin',
                    views: {
                        "main_content":
                            {
                                templateUrl: "/admin/",
                                controller: 'AdminController'
                            }
                    }
                }).
                state('admin.dashboard', {
                    url: '/dashboard',
                    views: {
                        "admin_content":
                            {
                                templateUrl: "/admin/partials/dashboard",
                                controller: 'AdminDashboardController'
                            }
                    }
                }).
                state('admin.modules', {
                    url: '/modules',
                    views: {
                        "admin_content":
                            {
                                templateUrl: "/admin/partials/modules",
                                controller: 'AdminModulesController'
                            }
                    }
                }).
                state('admin.dist', {
                    url: "/dist",
                    views: {
                        "admin_content":
                            {
                                templateUrl: "/admin/partials/dist",
                                controller: 'AdminDistController'
                            }
                    }
                }).
                state('admin.ui', {
                    url: "/customstyle",
                    views: {
                        "admin_content":
                            {
                                templateUrl: "/admin/partials/customstyle",
                                controller: 'AdminStyleController'
                            }
                    }
                });
        }
    ]
);