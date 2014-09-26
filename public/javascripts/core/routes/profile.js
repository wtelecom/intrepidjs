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
                state('profile', {
                    url: '/profile',
                    views: {
                        "main_content":
                            {
                                templateUrl: "/profile/",
                                controller: 'ProfileController'
                            }
                    }
                }).
                state('profile.detail', {
                    url: '/detail',
                    views: {
                        "profile_content":
                            {
                                templateUrl: "/profile/partials/profile",
                                controller: 'ProfileDetailController'
                            }
                    }
                }).
                state('profile.mail', {
                    url: '/mail',
                    views: {
                        "profile_content":
                            {
                                templateUrl: "/profile/partials/mail",
                                controller: 'ProfileMailController'
                            }
                    }
                }).
                state('profile.mail.inbox', {
                    url: '/inbox',
                    views: {
                        "table_content":
                            {
                                templateUrl: "/profile/partials/table",
                            }
                    }
                }).
                state('profile.mail.sent', {
                    url: '/sent',
                    views: {
                        "table_content":
                            {
                                templateUrl: "/profile/partials/table",
                            }
                    }
                }).
                state('profile.mail.read', {
                    url: '/:mail',
                    views: {
                        "panel_content":
                            {
                                templateUrl: "/profile/partials/read",
                                controller: 'ProfileMailReadController'
                            }
                    }
                });
        }
    ]
);