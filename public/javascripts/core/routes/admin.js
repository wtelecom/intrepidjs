/**
 * @file admin.js
 * @namespace Main admin angular routes
 * @desc Main admin angular routes
 */


angular.module('IntrepidJS').config(
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
                state('admin.users', {
                    url: '/users',
                    views: {
                        "admin_content":
                            {
                                templateUrl: "/admin/partials/users",
                                controller: 'AdminUsersController'
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
                }).
                state('admin.uiel', {
                    url: "/ui",
                    views: {
                        "admin_content":
                            {
                                templateUrl: "/admin/widget/custom/info",
                                controller: 'AdminUIController'
                            }
                    }
                }).
                state('admin.social', {
                    url: "/social",
                    views: {
                        "admin_content":
                            {
                                templateUrl: "/admin/widget/social/info",
                                controller: 'AdminSocialNetworkController'
                            }
                    }
                });
        }
    ]
);