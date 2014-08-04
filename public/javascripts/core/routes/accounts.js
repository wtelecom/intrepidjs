angular.module('WeTalk').config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            
            $stateProvider.
                state('/accounts/signup', {
                    url: '/accounts/signup',
                    //controller: 'SignupController',
                    views: {
                        "main_content":
                            {
                                templateUrl: "/accounts/signup"
                            }
                    }
                }).
                state('/accounts/login', {
                    url: "/accounts/login",
                    views: {
                        "main_content":
                            {
                                templateUrl: "/accounts/login"
                            }
                    }
                });
        }
    ]
);