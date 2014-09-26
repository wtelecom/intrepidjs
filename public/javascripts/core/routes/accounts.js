angular.module('IntrepidJS').config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            
            $stateProvider.
                state('signup', {
                    url: '/accounts/signup',
                    views: {
                        "main_content":
                            {
                                templateUrl: "/accounts/signup",
                                controller: 'SignupController'
                            }
                    }
                }).
                state('login', {
                    url: "/accounts/login",
                    views: {
                        "main_content":
                            {
                                templateUrl: "/accounts/login",
                                controller: 'HeaderController'
                            }
                    }
                });
        }
    ]
);