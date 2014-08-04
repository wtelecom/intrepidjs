// App main ng routes

angular.module('WeTalk').config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            
            $stateProvider.
                state('/', {
                    url: '/',
                    views: {
                        "main_content":
                            {
                                templateUrl: "/highlights",
                                controller: 'HighLightsController',
                            }
                    }
                });
        }
    ]
);